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
  followTargetId,
  isFirst,
  isLast,
  knownFollowing,
  isPlaceholder,
  follows,
}: {
  entry: UserCardEntry;
  followTargetId: string | undefined;
  isFirst: boolean;
  isLast: boolean;
  knownFollowing: boolean;
  isPlaceholder: boolean;
  follows: ReturnType<typeof useFollows>;
}) {
  let followAction;
  if (followTargetId) {
    const isFollowing = knownFollowing || follows.getStatus(followTargetId);
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
  profileId,
  viewerId,
  isPlaceholder,
  recipeActions,
  follows,
}: {
  entries: ProfileEntry[];
  tab: ProfileTab;
  profileId: string;
  viewerId: string;
  isPlaceholder: boolean;
  recipeActions?: RecipeActions;
  follows: ReturnType<typeof useFollows>;
}) {
  const isUserList = tab === 'followers' || tab === 'following';
  const followedProfileId = tab === 'followers' && profileId !== viewerId ? profileId : undefined;

  return (
    <ul {...stylex.props(styles.list, isUserList && styles.users)}>
      {entries.map((entry, index) =>
        'user' in entry ? (
          <ProfileUserRow
            key={entry.user.id}
            entry={entry}
            followTargetId={entry.user.id === viewerId ? followedProfileId : entry.user.id}
            isFirst={index === 0}
            isLast={index === entries.length - 1}
            knownFollowing={tab === 'following' || entry.user.id === viewerId}
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
