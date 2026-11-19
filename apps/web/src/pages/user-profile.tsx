import * as stylex from '@stylexjs/stylex';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router';

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
import { useAuth } from '@/hooks/use-auth';

import { styles } from './user-profile.stylex';

function Profile({ id, viewerId }: { id: string; viewerId: string }) {
  const [tab, setTab] = useState<ProfileTab>('recipes');
  const isOwn = viewerId === id;
  const tabs = isOwn ? OWN_PROFILE_TABS : OTHER_PROFILE_TABS;
  const needsFollowingLookup = !isOwn || tab === 'followers';

  const profile = useProfileQuery(viewerId, id);
  const follows = useFollows(viewerId, needsFollowingLookup);

  if (profile.isPending)
    return <Loader centered label="Loading profile…" xstyle={styles.message} />;
  if (profile.isError) {
    const notFound = isAxiosError(profile.error) && profile.error.response?.status === 404;
    return (
      <div role="alert" {...stylex.props(styles.message)}>
        <p>{notFound ? 'User not found.' : 'Could not load the profile.'}</p>
        {notFound ? (
          <Button to="/">Back to home</Button>
        ) : (
          <Button
            variant="outline"
            disabled={profile.isFetching}
            onClick={() => void profile.refetch()}
          >
            Try again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.layout)}>
      <ProfileInfo profile={profile.data} isOwn={isOwn} follows={follows} xstyle={styles.sidebar} />
      <section {...stylex.props(styles.content)} aria-label="Profile activity">
        <ProfileTabs tabs={tabs} activeTab={tab} onTabChange={setTab}>
          {needsFollowingLookup && follows.isError && (
            <div role="alert">
              <p>Could not check your subscriptions. Follow actions are unavailable.</p>
              <Button variant="outline" disabled={follows.isFetching} onClick={follows.retry}>
                Retry subscriptions
              </Button>
            </div>
          )}
          <ProfileItems key={tab} id={id} viewerId={viewerId} tab={tab} follows={follows} />
        </ProfileTabs>
      </section>
    </div>
  );
}

export default function UserProfilePage() {
  const { id = '' } = useParams<{ id: string }>();
  const { user } = useAuth();
  return (
    <Container xstyle={styles.page}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Profile' }]} />
      <MainTitle variant="h1" xstyle={styles.heading}>
        Profile
      </MainTitle>
      <Subtitle xstyle={styles.subtitle}>
        Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces
        with us.
      </Subtitle>
      {user && <Profile key={`${user.id}:${id}`} id={id} viewerId={user.id} />}
    </Container>
  );
}
