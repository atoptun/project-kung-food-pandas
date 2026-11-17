import type {
  CreateRecipeInput,
  PaginationQuery,
  RecipeCard,
  RecipeDetails,
  RecipeFilterQuery,
  RecipesListResponse,
  UserRecipesListResponse,
} from '@repo/shared';
import type { v2 as Cloudinary } from 'cloudinary';

import logger from '@/config/logger';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} from '@/errors/http.error';
import { Prisma, type PrismaClient } from '@/generated/prisma/client';

const cardSelect = {
  id: true,
  title: true,
  description: true,
  thumb: true,
  time: true,
  owner: { select: { id: true, name: true, avatar: true } },
  _count: { select: { favoriteRecipes: true } },
} as const;

const detailSelect = {
  ...cardSelect,
  instructions: true,
  category: { select: { id: true, name: true } },
  area: { select: { id: true, name: true } },
  ingredients: {
    select: { measure: true, ingredient: true },
    orderBy: { ingredientId: 'asc' },
  },
} as const;

type CardRow = Prisma.RecipeGetPayload<{ select: typeof cardSelect }>;

function toCard({ _count, ...recipe }: CardRow): RecipeCard {
  return { ...recipe, favoritesCount: _count.favoriteRecipes };
}

function toDetails({
  _count,
  ingredients,
  ...details
}: Prisma.RecipeGetPayload<{ select: typeof detailSelect }>): RecipeDetails {
  return {
    ...details,
    favoritesCount: _count.favoriteRecipes,
    ingredients: ingredients.map(({ ingredient, measure }) => ({ ...ingredient, measure })),
  };
}

export class RecipesService {
  constructor(
    private db: PrismaClient,
    private storage: typeof Cloudinary,
  ) {}

  list = async ({ category, area, ingredient, ...pagination }: RecipeFilterQuery) => {
    const where: Prisma.RecipeWhereInput = {
      ...(category !== undefined && { categoryId: category }),
      ...(area !== undefined && { areaId: area }),
      ...(ingredient !== undefined && { ingredients: { some: { ingredientId: ingredient } } }),
    };
    return this.listPaginated(where, pagination);
  };

  popular = async (limit: number): Promise<RecipeCard[]> => {
    const recipes = await this.db.recipe.findMany({
      select: cardSelect,
      orderBy: [{ favoriteRecipes: { _count: 'desc' } }, { id: 'asc' }],
      take: limit,
    });
    return recipes.map(toCard);
  };

  own = async (ownerId: string, pagination: PaginationQuery) =>
    this.listPaginated({ ownerId }, pagination);

  favorites = async (userId: string, pagination: PaginationQuery) =>
    this.listPaginated({ favoriteRecipes: { some: { userId } } }, pagination);

  addFavorite = async (recipeId: string, userId: string) => {
    const recipe = await this.db.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });
    if (!recipe) throw new NotFoundError('Recipe not found');

    try {
      // The composite primary key also prevents duplicates from concurrent requests.
      await this.db.favoriteRecipe.create({ data: { userId, recipeId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ConflictError('Recipe is already in favorites');
        // The recipe may have been deleted after the existence check.
        if (
          error.code === 'P2003' &&
          !(await this.db.recipe.findUnique({ where: { id: recipeId }, select: { id: true } }))
        ) {
          throw new NotFoundError('Recipe not found');
        }
      }
      throw error;
    }
    return { message: 'Recipe added to favorites successfully' };
  };

  removeFavorite = async (recipeId: string, userId: string) => {
    const { count } = await this.db.favoriteRecipe.deleteMany({ where: { userId, recipeId } });
    if (!count) throw new NotFoundError('Recipe not found or not in favorites');
    return { message: 'Recipe removed from favorites successfully' };
  };

  byAuthor = async (
    ownerId: string,
    pagination: PaginationQuery,
  ): Promise<UserRecipesListResponse> => {
    const user = await this.db.user.findUnique({ where: { id: ownerId }, select: { id: true } });
    if (!user) throw new NotFoundError('User not found');
    const result = await this.listPaginated({ ownerId }, pagination);
    return {
      ...result,
      items: result.items.map(({ id, title, description, thumb }) => ({
        id,
        title,
        description,
        thumb,
      })),
    };
  };

  detail = async (id: string): Promise<RecipeDetails> => {
    const recipe = await this.db.recipe.findUnique({ where: { id }, select: detailSelect });
    if (!recipe) throw new NotFoundError('Recipe not found');
    return toDetails(recipe);
  };

  create = async (
    ownerId: string,
    input: CreateRecipeInput,
    filePath: string,
  ): Promise<RecipeDetails> => {
    const { ingredients, ...fields } = input;
    const [category, area, ingredientCount] = await Promise.all([
      this.db.category.findUnique({ where: { id: input.categoryId }, select: { id: true } }),
      this.db.area.findUnique({ where: { id: input.areaId }, select: { id: true } }),
      this.db.ingredient.count({ where: { id: { in: ingredients.map(({ id }) => id) } } }),
    ]);
    const issues = [
      ...(!category ? [{ path: 'categoryId', message: 'Category not found' }] : []),
      ...(!area ? [{ path: 'areaId', message: 'Area not found' }] : []),
      ...(ingredientCount !== ingredients.length
        ? [{ path: 'ingredients', message: 'Ingredient not found' }]
        : []),
    ];
    if (issues.length) throw new UnprocessableEntityError('Validation failed', issues);

    const uploaded = await this.storage.uploader.upload(filePath, {
      folder: 'recipes',
      resource_type: 'image',
    });
    try {
      const recipe = await this.db.recipe.create({
        data: {
          ...fields,
          ownerId,
          thumb: uploaded.secure_url,
          ingredients: {
            create: ingredients.map(({ id, measure }) => ({ ingredientId: id, measure })),
          },
        },
        select: detailSelect,
      });
      return toDetails(recipe);
    } catch (error) {
      await this.storage.uploader.destroy(uploaded.public_id).catch((cleanupError: unknown) => {
        logger.warn(
          { err: cleanupError, publicId: uploaded.public_id },
          'Failed to remove unused recipe image',
        );
      });
      throw error;
    }
  };

  delete = async (id: string, ownerId: string) => {
    const recipe = await this.db.recipe.findUnique({ where: { id }, select: { ownerId: true } });
    if (!recipe) throw new NotFoundError('Recipe not found');
    if (recipe.ownerId !== ownerId)
      throw new ForbiddenError('You can only delete your own recipes');
    await this.db.recipe.delete({ where: { id, ownerId } });
    return { message: 'Recipe deleted successfully' };
  };

  private listPaginated = async (
    where: Prisma.RecipeWhereInput,
    { page, limit }: PaginationQuery,
  ): Promise<RecipesListResponse> => {
    const offset = (page - 1) * limit;
    const [recipes, total] = await Promise.all([
      // Prisma offsets use PostgreSQL int32; larger pages cannot contain rows.
      offset > 2147483647
        ? Promise.resolve([])
        : this.db.recipe.findMany({
            where,
            select: cardSelect,
            orderBy: { id: 'asc' },
            skip: offset,
            take: limit,
          }),
      this.db.recipe.count({ where }),
    ]);
    return { items: recipes.map(toCard), total, page, limit, totalPages: Math.ceil(total / limit) };
  };
}
