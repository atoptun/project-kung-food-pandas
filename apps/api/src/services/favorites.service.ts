import type { PaginationQuery, RecipeActionResponse, RecipesListResponse } from '@repo/shared';

import { ConflictError, NotFoundError } from '@/errors/http.error';
import type { PrismaClient } from '@/generated/prisma/client';
import { isPrismaError, PrismaErrorCode } from '@/lib/prisma-errors';

import { recipeCardSelect, toRecipeCard } from './recipe-card';

export class FavoritesService {
  constructor(private db: PrismaClient) {}

  /** Current user's favorites, most recently added first. */
  list = async (userId: string, { page, limit }: PaginationQuery): Promise<RecipesListResponse> => {
    const where = { userId };

    // One transaction keeps `items` and `total` consistent with each other.
    const [favorites, total] = await this.db.$transaction([
      this.db.favoriteRecipe.findMany({
        where,
        select: { recipe: { select: recipeCardSelect } },
        // `recipeId` breaks ties so pages never overlap when favorites share a timestamp.
        orderBy: [{ createdAt: 'desc' }, { recipeId: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.favoriteRecipe.count({ where }),
    ]);

    return {
      items: favorites.map(({ recipe }) => toRecipeCard(recipe, true)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  };

  add = async (userId: string, recipeId: string): Promise<RecipeActionResponse> => {
    try {
      // The composite primary key (userId, recipeId) rejects duplicates, even for concurrent
      // requests, so there is no separate "already exists" read.
      await this.db.favoriteRecipe.create({ data: { userId, recipeId } });
    } catch (error) {
      if (isPrismaError(error, PrismaErrorCode.UniqueConstraint)) {
        throw new ConflictError('Recipe is already in favorites');
      }
      // The user comes from the session, so a broken relation means the recipe does not exist.
      if (isPrismaError(error, PrismaErrorCode.ForeignKeyConstraint)) {
        throw new NotFoundError('Recipe not found');
      }
      throw error;
    }

    return { message: 'Recipe added to favorites successfully' };
  };

  /** Removes only the favorite relation; the recipe itself is untouched. */
  remove = async (userId: string, recipeId: string): Promise<RecipeActionResponse> => {
    const { count } = await this.db.favoriteRecipe.deleteMany({ where: { userId, recipeId } });

    if (count === 0) {
      throw new NotFoundError('Recipe not found or not in favorites');
    }

    return { message: 'Recipe removed from favorites successfully' };
  };

  /**
   * Which of the given recipes the user has in favorites.
   * Use it to fill `isFavorite` on recipe cards and details; a guest has none.
   */
  findFavoriteIds = async (
    userId: string | undefined,
    recipeIds: readonly string[],
  ): Promise<Set<string>> => {
    if (!userId || recipeIds.length === 0) {
      return new Set();
    }

    const favorites = await this.db.favoriteRecipe.findMany({
      where: { userId, recipeId: { in: [...recipeIds] } },
      select: { recipeId: true },
    });

    return new Set(favorites.map(({ recipeId }) => recipeId));
  };
}
