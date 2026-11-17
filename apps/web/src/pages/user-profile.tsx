import * as stylex from '@stylexjs/stylex';
import { isAxiosError } from 'axios';
import { useId, useState } from 'react';
import { useParams } from 'react-router';

import { useFollows, useProfileQuery } from '@/api/users/users.queries';
import { styles } from '@/components/profile/profile.stylex';
import ProfileInfo from '@/components/profile/profile-info';
import ProfileItems, { type ProfileTab } from '@/components/profile/profile-items';
import Breadcrumbs from '@/components/shared/breadcrumbs/breadcrumbs';
import Button from '@/components/shared/button/button';
import Container from '@/components/shared/container/container';
import { useAuth } from '@/hooks/use-auth';
import { typography } from '@/styles/typography.stylex';

function Profile({ id, viewerId }: { id: string; viewerId: string }) {
  const [tab, setTab] = useState<ProfileTab>('recipes');
  const prefix = useId();
  const isOwn = viewerId === id;
  const profile = useProfileQuery(viewerId, id);
  const follows = useFollows();
  const tabs: Array<{ id: ProfileTab; label: string }> = isOwn
    ? [
        { id: 'recipes', label: 'My recipes' },
        { id: 'favorites', label: 'My favorites' },
        { id: 'followers', label: 'Followers' },
        { id: 'following', label: 'Following' },
      ]
    : [
        { id: 'recipes', label: 'Recipes' },
        { id: 'followers', label: 'Followers' },
      ];

  if (profile.isPending)
    return (
      <p role="status" {...stylex.props(styles.message)}>
        Loading profile…
      </p>
    );
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
      <ProfileInfo profile={profile.data} isOwn={isOwn} follows={follows} />
      <section {...stylex.props(styles.content)} aria-label="Profile activity">
        <div role="tablist" aria-label="Profile sections" {...stylex.props(styles.tabs)}>
          {tabs.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${prefix}-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`${prefix}-panel`}
              tabIndex={tab === item.id ? 0 : -1}
              {...stylex.props(styles.tab, tab === item.id && styles.active)}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => {
                const nextIndex =
                  event.key === 'ArrowRight'
                    ? (index + 1) % tabs.length
                    : event.key === 'ArrowLeft'
                      ? (index + tabs.length - 1) % tabs.length
                      : event.key === 'Home'
                        ? 0
                        : event.key === 'End'
                          ? tabs.length - 1
                          : -1;
                if (nextIndex < 0) return;
                event.preventDefault();
                setTab(tabs[nextIndex]!.id);
                const next =
                  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                    '[role="tab"]',
                  )[nextIndex];
                next?.focus();
                next?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        {follows.isError && (
          <div role="alert">
            <p>Could not check your subscriptions. Follow actions are unavailable.</p>
            <Button variant="outline" disabled={follows.isFetching} onClick={follows.retry}>
              Retry subscriptions
            </Button>
          </div>
        )}
        <div
          role="tabpanel"
          id={`${prefix}-panel`}
          aria-labelledby={`${prefix}-${tab}`}
          tabIndex={0}
        >
          <ProfileItems key={tab} id={id} viewerId={viewerId} tab={tab} follows={follows} />
        </div>
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
      <h1 {...stylex.props(typography.h2, styles.heading)}>Profile</h1>
      <p {...stylex.props(typography.main, styles.subtitle)}>
        Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces
        with us.
      </p>
      {user && <Profile key={`${user.id}:${id}`} id={id} viewerId={user.id} />}
    </Container>
  );
}
