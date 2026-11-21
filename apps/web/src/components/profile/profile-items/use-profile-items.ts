import type { PaginationQuery, RecipeCard, UserFollowersListResponse } from '@repo/shared';
import {
  keepPreviousData,
  type QueryKey,
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { startTransition, useEffect, useState } from 'react';

import { favoritesApi } from '@/api/favorites/favorites.api';
import { useFavorites } from '@/api/favorites/favorites.queries';
import { queryKeys } from '@/api/keys';
import { recipesApi } from '@/api/recipes/recipes.api';
import { usersApi } from '@/api/users/users.api';

import { PROFILE_PAGE_SIZES, type ProfileTab } from '../profile.constants';

export type ProfileEntry = RecipeCard | UserFollowersListResponse['items'][number];
type ProfilePage = { items: ProfileEntry[]; page: number; totalPages: number };

function getProfilePageQuery(
  tab: ProfileTab,
  id: string,
  viewerId: string,
  params: PaginationQuery,
): { queryKey: QueryKey; queryFn: () => Promise<ProfilePage> } {
  switch (tab) {
    case 'favorites':
      return {
        queryKey: queryKeys.favorites.list({ viewerId, ...params }),
        queryFn: () => favoritesApi.getPage(params),
      };
    case 'recipes':
      return {
        queryKey: queryKeys.recipes.list({ ownerId: id, viewerId, ...params }),
        queryFn: () =>
          id === viewerId ? recipesApi.getOwn(params) : usersApi.getRecipes(id, params),
      };
    case 'following':
      return {
        queryKey: queryKeys.users.list(viewerId, id, tab, params.page),
        queryFn: () => usersApi.getFollowing(params),
      };
    case 'followers':
      return {
        queryKey: queryKeys.users.list(viewerId, id, tab, params.page),
        queryFn: () => usersApi.getFollowers(id, params),
      };
  }
}

export function useProfileItems(tab: ProfileTab, id: string, viewerId: string) {
  const [page, setPage] = useState(1);
  const client = useQueryClient();
  const favorites = useFavorites();

  const query = useQuery({
    ...getProfilePageQuery(tab, id, viewerId, { page, limit: PROFILE_PAGE_SIZES[tab] }),
    placeholderData: keepPreviousData,
    // The previous page can have an outdated total after another client removes items.
    staleTime: 0,
  });

  const mutationKey = [...queryKeys.recipes.all, 'remove', viewerId];
  const filters = { mutationKey, exact: true };
  const recipeRemovals = useMutationState({
    filters: { ...filters, status: 'pending' },
    select: (mutation) => mutation.state.variables,
  });
  const removeRecipe = useMutation({
    mutationKey,
    mutationFn: recipesApi.remove,
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.recipes.all }),
        client.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        client.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]),
  });

  const lastAvailablePage = Math.max(1, query.data?.totalPages ?? page);
  const needsPageCorrection =
    query.isSuccess &&
    query.fetchStatus === 'idle' &&
    !query.isPlaceholderData &&
    query.data.page === page &&
    page > lastAvailablePage;

  useEffect(() => {
    if (!needsPageCorrection) return;

    // A user-initiated page change takes priority over the server-driven correction.
    startTransition(() => {
      setPage((current) => (current === page ? lastAvailablePage : current));
    });
  }, [lastAvailablePage, needsPageCorrection, page]);

  const [recipePendingRemoval, setRecipePendingRemoval] = useState<string | null>(null);

  function handleRemoveRecipe(recipeId: string) {
    if (tab === 'favorites') {
      // The favorites page establishes membership.
      favorites.toggleFavorite({ id: recipeId, isFavorite: true });
      return;
    }

    setRecipePendingRemoval(recipeId);
  }

  function confirmRemoveRecipe() {
    if (!recipePendingRemoval) return;
    const idToRemove = recipePendingRemoval;
    const isPending = client.isMutating({
      ...filters,
      predicate: (mutation) => mutation.state.variables === idToRemove,
    });
    if (!isPending) {
      removeRecipe.mutate(idToRemove, {
        onSettled: () => setRecipePendingRemoval(null),
      });
    }
  }

  function cancelRemoveRecipe() {
    setRecipePendingRemoval(null);
  }

  function isRemovalPending(recipeId: string) {
    if (tab === 'favorites') return favorites.isFavoritePending(recipeId);
    return recipeRemovals.includes(recipeId);
  }

  return {
    query,
    page,
    setPage,
    needsPageCorrection,
    handleRemoveRecipe,
    confirmRemoveRecipe,
    cancelRemoveRecipe,
    recipePendingRemoval,
    isRemovalPending,
  };
}
