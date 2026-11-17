import {
  type QueryClient,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useAuthModalStore } from '@/stores/auth-modal.store';

import { queryKeys } from '../keys';
import type { RecipeDetails } from '../recipes/recipes.types';
import { favoritesApi } from './favorites.api';

const FAVORITE_MUTATION_KEY = [...queryKeys.favorites.all, 'toggle'] as const;

type FavoriteToggleVariables = {
  id: string;
  /** `true` adds the recipe to favorites, `false` removes it. */
  add: boolean;
};

type FavoriteToggleContext = {
  previousIds?: string[];
};

export const useFavoriteIdsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.favorites.ids(userId ?? ''),
    queryFn: () => favoritesApi.getAllIds(),
    enabled: Boolean(userId),
  });
};

function shiftFavoritesCount(queryClient: QueryClient, id: string, delta: number) {
  queryClient.setQueryData<RecipeDetails>(queryKeys.recipes.detail(id), (recipe) =>
    recipe
      ? { ...recipe, favoritesCount: Math.max(0, (recipe.favoritesCount ?? 0) + delta) }
      : recipe,
  );
}

/**
 * Shared favorites state and actions for the recipe page, catalog and profile.
 * Every page must use this hook instead of keeping its own copy of the favorites state:
 * it updates optimistically, rolls back on error and refreshes recipes, favorites and profile data.
 */
export function useFavorites() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isPending: isAuthPending } = useAuth();
  const openSignIn = useAuthModalStore((state) => state.openSignIn);

  const userId = user?.id;
  const idsKey = queryKeys.favorites.ids(userId ?? '');
  const idsQuery = useFavoriteIdsQuery(userId);

  const favoriteIds = useMemo(() => new Set(idsQuery.data ?? []), [idsQuery.data]);

  const pendingIds = useMutationState({
    filters: { mutationKey: FAVORITE_MUTATION_KEY, status: 'pending' },
    select: (mutation) => (mutation.state.variables as FavoriteToggleVariables | undefined)?.id,
  });

  const { mutate } = useMutation<void, Error, FavoriteToggleVariables, FavoriteToggleContext>({
    mutationKey: FAVORITE_MUTATION_KEY,
    mutationFn: ({ id, add }) => (add ? favoritesApi.add(id) : favoritesApi.remove(id)),
    onMutate: async ({ id, add }) => {
      await queryClient.cancelQueries({ queryKey: idsKey });
      const previousIds = queryClient.getQueryData<string[]>(idsKey);

      queryClient.setQueryData<string[]>(idsKey, (ids = []) =>
        add ? [...new Set([...ids, id])] : ids.filter((favoriteId) => favoriteId !== id),
      );
      shiftFavoritesCount(queryClient, id, add ? 1 : -1);

      return { previousIds };
    },
    onError: (_error, { id, add }, context) => {
      queryClient.setQueryData(idsKey, context?.previousIds);
      shiftFavoritesCount(queryClient, id, add ? -1 : 1);
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]),
  });

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds]);

  const isFavoritePending = useCallback(
    (id: string) =>
      isAuthPending || (isAuthenticated && idsQuery.isPending) || pendingIds.includes(id),
    [isAuthPending, isAuthenticated, idsQuery.isPending, pendingIds],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (isAuthPending) return;

      if (!isAuthenticated) {
        openSignIn();
        return;
      }

      if (pendingIds.includes(id)) return;

      mutate({ id, add: !favoriteIds.has(id) });
    },
    [isAuthPending, isAuthenticated, openSignIn, pendingIds, mutate, favoriteIds],
  );

  return { isFavorite, isFavoritePending, toggleFavorite };
}
