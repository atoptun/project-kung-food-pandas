import * as stylex from '@stylexjs/stylex';

import type { useFollows } from '@/api/users/users.queries';
import Button from '@/components/shared/button/button';
import Loader from '@/components/shared/loader/loader';
import Pagination from '@/components/shared/pagination/pagination';

import type { ProfileTab } from '../profile.constants';
import { getEmptyMessage } from '../profile.utils';
import { styles } from './profile-items.stylex';
import ProfileList from './profile-list';
import { useProfileItems } from './use-profile-items';

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
  const { query, page, setPage, needsPageCorrection, handleRemoveRecipe, isRemovalPending } =
    useProfileItems(tab, id, viewerId);
  const isOwn = id === viewerId;

  if (
    query.isPending ||
    needsPageCorrection ||
    (query.isPlaceholderData && !query.data.items.length)
  ) {
    return <Loader centered label={`Loading ${tab}…`} xstyle={styles.listMessage} />;
  }

  if (query.isError) {
    return (
      <div role="alert" {...stylex.props(styles.message, styles.listMessage)}>
        <p>Could not load {tab}.</p>
        <Button variant="outline" disabled={query.isFetching} onClick={() => void query.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const { items, totalPages } = query.data;

  if (!items.length) {
    return (
      <div {...stylex.props(styles.message, styles.listMessage)}>
        <p {...stylex.props(styles.messageText)}>{getEmptyMessage(tab, isOwn)}</p>
      </div>
    );
  }

  const canRemoveRecipes = isOwn && (tab === 'recipes' || tab === 'favorites');
  const recipeActions = canRemoveRecipes
    ? { onRemove: handleRemoveRecipe, isPending: isRemovalPending }
    : undefined;

  return (
    <div aria-busy={query.isFetching}>
      <ProfileList
        entries={items}
        tab={tab}
        profileId={id}
        viewerId={viewerId}
        isPlaceholder={query.isPlaceholderData}
        recipeActions={recipeActions}
        follows={follows}
      />
      <div {...stylex.props(styles.pagination)}>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
