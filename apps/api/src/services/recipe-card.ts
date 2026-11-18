import type { RecipeCard } from '@repo/shared';

import type { Prisma } from '@/generated/prisma/client';

/**
 * Prisma selection for the `RecipeCard` contract.
 * Every endpoint that returns recipe cards should use it so the payload stays identical.
 */
export const recipeCardSelect = {
  id: true,
  title: true,
  description: true,
  thumb: true,
  time: true,
  owner: { select: { id: true, name: true, avatar: true } },
  _count: { select: { favoriteRecipes: true } },
} as const satisfies Prisma.RecipeSelect;

export type RecipeCardRow = Prisma.RecipeGetPayload<{ select: typeof recipeCardSelect }>;

/** `isFavorite` is viewer-specific, so the caller decides it for the current user. */
export function toRecipeCard(
  { _count, ...recipe }: RecipeCardRow,
  isFavorite: boolean,
): RecipeCard {
  return {
    ...recipe,
    favoritesCount: _count.favoriteRecipes,
    isFavorite,
  };
}
