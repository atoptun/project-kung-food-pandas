import type { RecipeCard } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';

import type { useFollows } from '@/api/users/users.queries';
import RecipePreview from '@/components/recipes/recipe-preview/recipe-preview';
import UserCard, { type UserCardEntry } from '@/components/users/user-card/user-card';

import type { ProfileTab } from '../profile.constants';
import { styles } from './profile-list.stylex';
import type { ProfileEntry } from './use-profile-items';

type RecipeActions = {
  onRemove: (id: string) => void;
  isPending: (id: string) => boolean;
};

function ProfileRecipeRow({
  recipe,
  isFavorite,
  isPlaceholder,
  actions,
}: {
  recipe: RecipeCard;
  isFavorite: boolean;
  isPlaceholder: boolean;
  actions?: RecipeActions;
}) {
  const removeLabel = isFavorite
    ? `Remove ${recipe.title} from favorites`
    : `Delete recipe: ${recipe.title}`;

  return (
    <li>
      <RecipePreview
        recipe={recipe}
        isPending={isPlaceholder || actions?.isPending(recipe.id)}
        removeLabel={actions ? removeLabel : undefined}
        onRemove={actions ? () => actions.onRemove(recipe.id) : undefined}
      />
    </li>
  );
}

function ProfileUserRow({
  entry,
  viewerId,
  viewerRowUnfollowTargetId,
  isFirst,
  isLast,
  isPlaceholder,
  follows,
}: {
  entry: UserCardEntry;
  viewerId: string;
  viewerRowUnfollowTargetId?: string;
  isFirst: boolean;
  isLast: boolean;
  isPlaceholder: boolean;
  follows: ReturnType<typeof useFollows>;
}) {
  // On another profile, the viewer's own follower card can unfollow the owner.
  const isViewer = entry.user.id === viewerId;
  const followTargetId = isViewer ? viewerRowUnfollowTargetId : entry.user.id;
  let followAction;
  if (followTargetId) {
    const isFollowing = isViewer || entry.isFollowing;
    followAction = {
      isFollowing,
      isPending: isPlaceholder || follows.isPending(followTargetId),
      onToggle: () => follows.toggle(followTargetId, isFollowing),
    };
  }

  return (
    <li {...stylex.props(styles.userRow, isFirst && styles.firstUser, isLast && styles.lastUser)}>
      <UserCard entry={entry} followAction={followAction} />
    </li>
  );
}

export default function ProfileList({
  entries,
  tab,
  viewerRowUnfollowTargetId,
  viewerId,
  isPlaceholder,
  recipeActions,
  follows,
}: {
  entries: ProfileEntry[];
  tab: ProfileTab;
  viewerRowUnfollowTargetId?: string;
  viewerId: string;
  isPlaceholder: boolean;
  recipeActions?: RecipeActions;
  follows: ReturnType<typeof useFollows>;
}) {
  const isUserList = tab === 'followers' || tab === 'following';

  return (
    <ul {...stylex.props(styles.list, isUserList && styles.users)}>
      {entries.map((entry, index) =>
        'user' in entry ? (
          <ProfileUserRow
            key={entry.user.id}
            entry={entry}
            viewerId={viewerId}
            viewerRowUnfollowTargetId={viewerRowUnfollowTargetId}
            isFirst={index === 0}
            isLast={index === entries.length - 1}
            isPlaceholder={isPlaceholder}
            follows={follows}
          />
        ) : (
          <ProfileRecipeRow
            key={entry.id}
            recipe={entry}
            isFavorite={tab === 'favorites'}
            isPlaceholder={isPlaceholder}
            actions={recipeActions}
          />
        ),
      )}
    </ul>
  );
}
