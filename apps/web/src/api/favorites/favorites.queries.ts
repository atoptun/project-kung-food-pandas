import {
  type QueryKey,
  useMutation,
  useMutationState,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useAuthModalStore } from '@/stores/auth-modal.store';

import { queryKeys } from '../keys';
import type { RecipeCard } from '../recipes/recipes.types';
import { favoritesApi } from './favorites.api';

const FAVORITE_MUTATION_KEY = [...queryKeys.favorites.all, 'toggle'] as const;

/** What a card or page knows about a recipe to toggle it. */
export type FavoriteTarget = Pick<RecipeCard, 'id' | 'isFavorite'>;

type FavoriteToggleVariables = {
  id: string;
  /** `true` adds the recipe to favorites, `false` removes it. */
  add: boolean;
};

type FavoriteToggleContext = {
  snapshot: Array<[QueryKey, unknown]>;
};

type RecipeLike = Pick<RecipeCard, 'id' | 'isFavorite' | 'favoritesCount'>;

function isRecipeLike(value: unknown): value is RecipeLike {
  return typeof value === 'object' && value !== null && 'id' in value && 'title' in value;
}

function patchRecipe<T>(value: T, id: string, add: boolean): T {
  if (!isRecipeLike(value) || value.id !== id) return value;

  const delta = add ? 1 : -1;
  return {
    ...value,
    isFavorite: add,
    favoritesCount:
      value.favoritesCount === undefined ? undefined : Math.max(0, value.favoritesCount + delta),
  };
}

/**
 * Applies the new favorite state to every cached shape that contains the recipe:
 * details (`RecipeDetails`), popular (`RecipeCard[]`) and paginated lists (`{ items }`).
 */
function patchCachedRecipe(data: unknown, id: string, add: boolean): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => patchRecipe(item, id, add));
  }

  if (typeof data === 'object' && data !== null && 'items' in data && Array.isArray(data.items)) {
    return { ...data, items: data.items.map((item) => patchRecipe(item, id, add)) };
  }

  return patchRecipe(data, id, add);
}

/**
 * Shared favorites actions for the recipe page, catalog and profile.
 * The state itself comes from the API (`recipe.isFavorite`); this hook updates every cached copy
 * optimistically, rolls back on error and refreshes recipes, favorites and profile counters.
 */
export function useFavorites() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isPending: isAuthPending } = useAuth();
  const openSignIn = useAuthModalStore((state) => state.openSignIn);

  const pendingIds = useMutationState({
    filters: { mutationKey: FAVORITE_MUTATION_KEY, status: 'pending' },
    select: (mutation) => (mutation.state.variables as FavoriteToggleVariables | undefined)?.id,
  });

  const { mutate } = useMutation<void, Error, FavoriteToggleVariables, FavoriteToggleContext>({
    mutationKey: FAVORITE_MUTATION_KEY,
    mutationFn: ({ id, add }) => (add ? favoritesApi.add(id) : favoritesApi.remove(id)),
    onMutate: async ({ id, add }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.recipes.all });

      const snapshot = queryClient.getQueriesData({ queryKey: queryKeys.recipes.all });
      queryClient.setQueriesData({ queryKey: queryKeys.recipes.all }, (data: unknown) =>
        patchCachedRecipe(data, id, add),
      );

      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]),
  });

  /** A guest never sees a filled heart, even if a stale cache says otherwise. */
  const isFavorite = useCallback(
    (recipe: FavoriteTarget) => isAuthenticated && recipe.isFavorite === true,
    [isAuthenticated],
  );

  const isFavoritePending = useCallback(
    (id: string) => isAuthPending || pendingIds.includes(id),
    [isAuthPending, pendingIds],
  );

  const toggleFavorite = useCallback(
    (recipe: FavoriteTarget) => {
      if (isAuthPending) return;

      if (!isAuthenticated) {
        openSignIn();
        return;
      }

      if (pendingIds.includes(recipe.id)) return;

      mutate({ id: recipe.id, add: recipe.isFavorite !== true });
    },
    [isAuthPending, isAuthenticated, openSignIn, pendingIds, mutate],
  );

  return { isFavorite, isFavoritePending, toggleFavorite };
}
