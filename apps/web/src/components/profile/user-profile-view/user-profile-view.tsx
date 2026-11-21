import * as stylex from '@stylexjs/stylex';
import { isAxiosError } from 'axios';
// import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useFollows, useProfileQuery } from '@/api/users/users.queries';
import {
  OTHER_PROFILE_TABS,
  OWN_PROFILE_TABS,
  type ProfileTab,
} from '@/components/profile/profile.constants';
import ProfileInfo from '@/components/profile/profile-info/profile-info';
import ProfileItems from '@/components/profile/profile-items/profile-items';
import ProfileTabs from '@/components/profile/profile-tabs/profile-tabs';
import Breadcrumbs from '@/components/shared/breadcrumbs/breadcrumbs';
import Button from '@/components/shared/button/button';
import Container from '@/components/shared/container/container';
import Loader from '@/components/shared/loader/loader';
import MainTitle from '@/components/shared/main-title/main-title';
import Subtitle from '@/components/shared/subtitle/subtitle';

import { styles } from './user-profile-view.stylex';

const BREADCRUMB_ITEMS = [{ label: 'Home', to: '/' }, { label: 'Profile' }] as const;

export interface UserProfileViewProps {
  id: string;
  initialTab?: string;
  viewerId: string;
}

export function UserProfileView({ id, initialTab, viewerId }: UserProfileViewProps) {
  const navigate = useNavigate();
  // const [tab, setTab] = useState<ProfileTab>('recipes');
  const isOwn = viewerId === id;
  const tabs = isOwn ? OWN_PROFILE_TABS : OTHER_PROFILE_TABS;
  const profile = useProfileQuery(viewerId, id);
  const follows = useFollows(viewerId);

  if (profile.isPending) {
    return (
      <Container xstyle={styles.page}>
        <Breadcrumbs items={BREADCRUMB_ITEMS} />
        <Loader centered label="Loading profile…" xstyle={styles.message} />;
      </Container>
    );
  }

  if (profile.isError) {
    return (
      <Container xstyle={styles.page}>
        <Breadcrumbs items={BREADCRUMB_ITEMS} />
        <ProfileError
          error={profile.error}
          isFetching={profile.isFetching}
          onRetry={() => void profile.refetch()}
        />
      </Container>
    );
  }

  const activeTab: ProfileTab =
    initialTab && tabs.some((t) => t.id === initialTab) ? (initialTab as ProfileTab) : 'recipes';

  const handleTabChange = (nextTab: ProfileTab) => {
    const path = nextTab === 'recipes' ? `/user/${id}` : `/user/${id}/${nextTab}`;
    navigate(path, { replace: true, preventScrollReset: true });
  };

  return (
    <Container xstyle={styles.page}>
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <MainTitle variant="h1" xstyle={styles.heading}>
        Profile
      </MainTitle>
      <Subtitle xstyle={styles.subtitle}>
        Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces
        with us.
      </Subtitle>

      <div {...stylex.props(styles.layout)}>
        <ProfileInfo
          profile={profile.data}
          isOwn={isOwn}
          follows={follows}
          xstyle={styles.sidebar}
        />
        <section {...stylex.props(styles.content)} aria-label="Profile activity">
          <ProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}>
            <ProfileItems
              key={activeTab}
              id={id}
              viewerId={viewerId}
              tab={activeTab}
              follows={follows}
            />
          </ProfileTabs>
        </section>
      </div>
    </Container>
  );
}

function ProfileError({
  error,
  isFetching,
  onRetry,
}: {
  error: unknown;
  isFetching: boolean;
  onRetry: () => void;
}) {
  const isNotFound = isAxiosError(error) && error.response?.status === 404;

  return (
    <div role="alert" {...stylex.props(styles.message)}>
      <p>{isNotFound ? 'User not found.' : 'Could not load the profile.'}</p>
      {isNotFound ? (
        <Button to="/">Back to home</Button>
      ) : (
        <Button variant="outline" disabled={isFetching} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default UserProfileView;
