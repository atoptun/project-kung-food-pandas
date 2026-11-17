import type { RecipeCard } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { favoritesApi } from '@/api/favorites/favorites.api';
import { useFavorites } from '@/api/favorites/favorites.queries';
import { queryKeys } from '@/api/keys';
import { recipesApi } from '@/api/recipes/recipes.api';
import { usersApi } from '@/api/users/users.api';
import type { useFollows } from '@/api/users/users.queries';
import Button from '@/components/shared/button/button';
import Pagination from '@/components/shared/pagination/pagination';

import { styles } from './profile.stylex';
import RecipePreview from './recipe-preview';
import UserCard, { type ProfileUser } from './user-card';

export type ProfileTab = 'recipes' | 'favorites' | 'followers' | 'following';

const EMPTY_MESSAGES: Record<ProfileTab, string> = {
  recipes:
    'Nothing has been added to your recipes list yet. Please browse our recipes and add your favorites for easy access in the future.',
  favorites:
    'Nothing has been added to your favorite recipes list yet. Please browse our recipes and add your favorites for easy access in the future.',
  followers:
    'There are currently no followers on your account. Please engage our visitors with interesting content and draw their attention to your profile.',
  following:
    'Your account currently has no subscriptions to other users. Learn more about our users and select those whose content interests you.',
};

export default function ProfileItems({
  id,
  viewerId,
  tab,
  follows,
}: {
  id: string;
  viewerId: string;
  tab: ProfileTab;
  follows: ReturnType<typeof useFollows>;
}) {
  const [page, setPage] = useState(1);
  const client = useQueryClient();
  const favorites = useFavorites();
  const isOwn = id === viewerId;
  const isUsers = tab === 'followers' || tab === 'following';
  const limit = isUsers ? 5 : 9;
  const queryKey =
    tab === 'favorites'
      ? [...queryKeys.favorites.lists(), viewerId, page, limit]
      : tab === 'recipes'
        ? queryKeys.recipes.list({ ownerId: id, viewerId, page, limit })
        : queryKeys.users.list(viewerId, id, tab, page);

  const query = useQuery<{ items: Array<RecipeCard | ProfileUser>; totalPages: number }>({
    queryKey,
    queryFn: async () => {
      const params = { page, limit };
      if (tab === 'favorites') return favoritesApi.getPage(params);
      if (tab === 'recipes')
        return isOwn ? recipesApi.getOwn(params) : usersApi.getRecipes(id, params);
      const result =
        tab === 'following'
          ? await usersApi.getFollowing(params)
          : await usersApi.getFollowers(id, params);
      return { items: result.users, totalPages: result.pagination.totalPages };
    },
    placeholderData: keepPreviousData,
  });
  const removeRecipe = useMutation({
    mutationFn: recipesApi.remove,
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.recipes.all }),
        client.invalidateQueries({ queryKey: queryKeys.favorites.all }),
        client.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]);
    },
  });

  // The server is authoritative after delete/unfollow, including concurrent removals.
  // Changing the key fetches the previous available page instead of leaving an empty page.
  if (query.data && !query.isPlaceholderData && page > Math.max(1, query.data.totalPages)) {
    setPage(Math.max(1, query.data.totalPages));
  }

  if (query.isPending)
    return (
      <p role="status" {...stylex.props(styles.message, styles.listMessage)}>
        Loading {tab}…
      </p>
    );
  if (query.isError)
    return (
      <div role="alert" {...stylex.props(styles.message, styles.listMessage)}>
        <p>Could not load {tab}.</p>
        <Button variant="outline" disabled={query.isFetching} onClick={() => void query.refetch()}>
          Try again
        </Button>
      </div>
    );
  if (!query.data.items.length)
    return (
      <div {...stylex.props(styles.message, styles.listMessage)}>
        <p {...stylex.props(styles.messageText)}>
          {isOwn
            ? EMPTY_MESSAGES[tab]
            : tab === 'recipes'
              ? 'This user has not added any recipes yet.'
              : 'This user has no followers yet.'}
        </p>
      </div>
    );

  return (
    <div aria-busy={query.isFetching}>
      <ul {...stylex.props(styles.list, isUsers && styles.users)}>
        {query.data.items.map((item, index) => (
          <li
            key={item.id}
            {...stylex.props(
              isUsers && styles.userRow,
              isUsers && index === 0 && styles.firstUser,
              isUsers && index === query.data.items.length - 1 && styles.lastUser,
            )}
          >
            {'recipes' in item ? (
              <UserCard
                user={item}
                isSelf={item.id === viewerId}
                isFollowing={follows.isFollowing(item.id)}
                isPending={query.isPlaceholderData || follows.isPending(item.id)}
                onToggle={() => follows.toggle(item.id)}
              />
            ) : (
              <RecipePreview
                recipe={item}
                isPending={
                  query.isPlaceholderData ||
                  (tab === 'favorites'
                    ? favorites.isFavoritePending(item.id)
                    : removeRecipe.isPending)
                }
                removeLabel={
                  tab === 'favorites'
                    ? `Remove ${item.title} from favorites`
                    : `Delete recipe: ${item.title}`
                }
                onRemove={
                  !isOwn
                    ? undefined
                    : () => {
                        if (tab === 'favorites')
                          void favorites.removeFavorite(item.id).catch(() => {
                            /* Shared mutation reports the error. */
                          });
                        else removeRecipe.mutate(item.id);
                      }
                }
              />
            )}
          </li>
        ))}
      </ul>
      <div {...stylex.props(styles.pagination)}>
        <Pagination page={page} totalPages={query.data.totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
