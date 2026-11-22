import type {
  CreateRecipeInput,
  PaginationQuery,
  RecipeActionResponse,
  RecipeCard,
  RecipeDetails,
  RecipeFilterQuery,
  RecipesListResponse,
  UserRecipesListResponse,
} from '@repo/shared';

import env from '@/config/env';
import logger from '@/config/logger';
import {
  BadRequestError,
  type ErrorIssue,
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} from '@/errors/http.error';
import type { Prisma, PrismaClient } from '@/generated/prisma/client';
import { deleteFromCloudinary, uploadFromBuffer } from '@/lib/cloudinary';

const RECIPES_FOLDER = 'recipes';

const recipeCardSelect = (viewerId?: string) =>
  ({
    id: true,
    title: true,
    thumb: true,
    description: true,
    time: true,
    owner: {
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    },
    _count: {
      select: {
        favoriteRecipes: true,
      },
    },
    favoriteRecipes: {
      where: { userId: viewerId ?? '' },
      select: { userId: true },
      take: 1,
    },
  }) satisfies Prisma.RecipeSelect;

const recipeDetailsSelect = (viewerId?: string) =>
  ({
    ...recipeCardSelect(viewerId),
    instructions: true,
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    area: {
      select: {
        id: true,
        name: true,
      },
    },
    ingredients: {
      select: {
        measure: true,
        ingredient: {
          select: {
            id: true,
            name: true,
            description: true,
            img: true,
          },
        },
      },
    },
  }) satisfies Prisma.RecipeSelect;

type RecipeCardRecord = Prisma.RecipeGetPayload<{ select: ReturnType<typeof recipeCardSelect> }>;
type RecipeDetailsRecord = Prisma.RecipeGetPayload<{
  select: ReturnType<typeof recipeDetailsSelect>;
}>;

function toPagination(total: number, page: number, limit: number) {
  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
  };
}

function toRecipeCard(recipe: RecipeCardRecord, viewerId?: string): RecipeCard {
  return {
    id: recipe.id,
    title: recipe.title,
    thumb: recipe.thumb,
    description: recipe.description,
    time: recipe.time,
    favoritesCount: recipe._count.favoriteRecipes,
    ...(viewerId ? { isFavorite: recipe.favoriteRecipes.length > 0 } : {}),
    owner: {
      id: recipe.owner.id,
      name: recipe.owner.name,
      avatar: recipe.owner.avatar,
    },
  };
}

function toRecipeDetails(recipe: RecipeDetailsRecord, viewerId?: string): RecipeDetails {
  return {
    ...toRecipeCard(recipe, viewerId),
    instructions: recipe.instructions,
    category: {
      id: recipe.category.id,
      name: recipe.category.name,
    },
    area: {
      id: recipe.area.id,
      name: recipe.area.name,
    },
    ingredients: recipe.ingredients.map((item) => ({
      id: item.ingredient.id,
      name: item.ingredient.name ?? '',
      description: item.ingredient.description,
      img: item.ingredient.img,
      measure: item.measure,
    })),
  };
}

function filterWhere(query: RecipeFilterQuery): Prisma.RecipeWhereInput {
  return {
    ...(query.category ? { categoryId: query.category } : {}),
    ...(query.area ? { areaId: query.area } : {}),
    ...(query.ingredient ? { ingredients: { some: { ingredientId: query.ingredient } } } : {}),
  };
}

export class RecipesService {
  constructor(private db: PrismaClient) {}

  list = async (query: RecipeFilterQuery, viewerId?: string): Promise<RecipesListResponse> => {
    const where = filterWhere(query);
    return this.listCards(where, query, viewerId);
  };

  listPopular = async (limit: number, viewerId?: string): Promise<RecipeCard[]> => {
    const items = await this.db.recipe.findMany({
      select: recipeCardSelect(viewerId),
      orderBy: [{ favoriteRecipes: { _count: 'desc' } }, { id: 'asc' }],
      take: limit,
    });

    return items.map((item) => toRecipeCard(item, viewerId));
  };

  listOwn = async (userId: string, query: PaginationQuery): Promise<RecipesListResponse> => {
    return this.listCards({ ownerId: userId }, query, userId);
  };

  listByUser = async (userId: string, query: PaginationQuery): Promise<UserRecipesListResponse> => {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const where = { ownerId: userId };
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      this.db.recipe.findMany({
        where,
        select: {
          id: true,
          title: true,
          thumb: true,
          description: true,
        },
        orderBy: [{ title: 'asc' }, { id: 'asc' }],
        skip,
        take: query.limit,
      }),
      this.db.recipe.count({ where }),
    ]);

    return {
      ...toPagination(total, query.page, query.limit),
      items,
    };
  };

  getById = async (id: string, viewerId?: string): Promise<RecipeDetails> => {
    const recipe = await this.db.recipe.findUnique({
      where: { id },
      select: recipeDetailsSelect(viewerId),
    });

    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    return toRecipeDetails(recipe, viewerId);
  };

  create = async (
    ownerId: string,
    input: CreateRecipeInput,
    buffer?: Buffer,
  ): Promise<RecipeDetails> => {
    await this.assertReferences(input);

    let thumb: string | null = null;
    let thumbId: string | null = null;

    if (buffer) {
      const uploaded = await uploadFromBuffer(buffer, {
        folder: `${env.CLOUDINARY_FOLDER_BASE}/${RECIPES_FOLDER}`,
      });
      thumb = uploaded.secure_url;
      thumbId = uploaded.public_id;
    }

    try {
      const recipe = await this.db.recipe.create({
        data: {
          title: input.title,
          description: input.description,
          instructions: input.instructions,
          time: input.time,
          thumb,
          thumbId,
          ownerId,
          categoryId: input.categoryId,
          areaId: input.areaId,
          ...(input.ingredients.length
            ? {
                ingredients: {
                  create: input.ingredients.map((item) => ({
                    ingredientId: item.id,
                    measure: item.measure,
                  })),
                },
              }
            : {}),
        },
        select: recipeDetailsSelect(ownerId),
      });

      return toRecipeDetails(recipe, ownerId);
    } catch (error) {
      if (thumbId) {
        await deleteFromCloudinary(thumbId).catch((err) => {
          logger.warn({ err, thumbId }, 'Failed to rollback Cloudinary upload after DB error');
        });
      }
      throw error;
    }
  };

  remove = async (userId: string, id: string): Promise<RecipeActionResponse> => {
    const recipe = await this.db.recipe.findUnique({
      where: { id },
      select: { id: true, ownerId: true },
    });

    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    if (recipe.ownerId !== userId) {
      throw new ForbiddenError('Access denied. You can only delete your own recipes');
    }

    const deleted = await this.db.recipe.delete({ where: { id } });

    if (deleted.thumbId) {
      await deleteFromCloudinary(deleted.thumbId);
    }

    return { message: 'Recipe deleted successfully' };
  };

  private listCards = async (
    where: Prisma.RecipeWhereInput,
    query: PaginationQuery,
    viewerId?: string,
  ): Promise<RecipesListResponse> => {
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      this.db.recipe.findMany({
        where,
        select: recipeCardSelect(viewerId),
        orderBy: [{ title: 'asc' }, { id: 'asc' }],
        skip,
        take: query.limit,
      }),
      this.db.recipe.count({ where }),
    ]);

    return {
      ...toPagination(total, query.page, query.limit),
      items: items.map((item) => toRecipeCard(item, viewerId)),
    };
  };

  private assertReferences = async (input: CreateRecipeInput) => {
    const ingredientIds = input.ingredients.map((item) => item.id);

    if (new Set(ingredientIds).size !== ingredientIds.length) {
      throw new UnprocessableEntityError('Validation failed', [
        { path: 'ingredients', message: 'Ingredient ids must be unique' },
      ]);
    }

    const [category, area, ingredients] = await Promise.all([
      this.db.category.findUnique({ where: { id: input.categoryId }, select: { id: true } }),
      this.db.area.findUnique({ where: { id: input.areaId }, select: { id: true } }),
      ingredientIds.length
        ? this.db.ingredient.findMany({
            where: { id: { in: ingredientIds } },
            select: { id: true },
          })
        : Promise.resolve([]),
    ]);

    const issues: ErrorIssue[] = [];

    if (!category) {
      issues.push({ path: 'categoryId', message: 'Category not found' });
    }

    if (!area) {
      issues.push({ path: 'areaId', message: 'Area not found' });
    }

    if (ingredients.length !== ingredientIds.length) {
      issues.push({ path: 'ingredients', message: 'Ingredient not found' });
    }

    if (issues.length) {
      throw new BadRequestError('Invalid input data', issues);
    }
  };
}
