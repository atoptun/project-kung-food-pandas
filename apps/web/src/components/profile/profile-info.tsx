import type { CurrentUserProfileResponse, UserPublicProfileResponse } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';

import { useAvatarUpload, type useFollows } from '@/api/users/users.queries';
import Avatar from '@/components/shared/avatar/avatar';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import { notify } from '@/lib/notify';
import { useAuthModalStore } from '@/stores/auth-modal.store';
import { typography } from '@/styles/typography.stylex';

import { styles } from './profile.stylex';

export default function ProfileInfo({
  profile,
  isOwn,
  follows,
}: {
  profile: CurrentUserProfileResponse | UserPublicProfileResponse;
  isOwn: boolean;
  follows: ReturnType<typeof useFollows>;
}) {
  const input = useRef<HTMLInputElement>(null);
  const upload = useAvatarUpload(profile.user.id);
  const openLogout = useAuthModalStore((state) => state.openLogout);
  const stats = [
    ['Email', profile.user.email],
    ['Added recipes', profile.recipesCount],
    ...('favoritesCount' in profile ? [['Favorites', profile.favoritesCount]] : []),
    ['Followers', profile.followersCount],
    ...('followingCount' in profile ? [['Following', profile.followingCount]] : []),
  ];

  return (
    <aside
      {...stylex.props(styles.sidebar)}
      aria-label={isOwn ? 'Your profile' : `${profile.user.name}'s profile`}
    >
      <div {...stylex.props(styles.info)}>
        <div {...stylex.props(styles.avatar)}>
          <Avatar src={profile.user.avatar} alt={profile.user.name} size="lg" />
          {isOwn && (
            <>
              <input
                ref={input}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label="Avatar image"
                {...stylex.props(styles.hiddenInput)}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (!file) return;
                  if (
                    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
                    file.size > 5 * 1024 * 1024
                  ) {
                    notify.error('Choose a JPEG, PNG or WebP image up to 5 MB.');
                    return;
                  }
                  upload.mutate(file);
                }}
              />
              <button
                type="button"
                aria-label="Change avatar"
                disabled={upload.isPending}
                onClick={() => input.current?.click()}
                {...stylex.props(styles.upload)}
              >
                <Icon name="plus" size={16} />
              </button>
            </>
          )}
        </div>
        <h2 {...stylex.props(typography.h4, styles.name)}>{profile.user.name}</h2>
        <dl {...stylex.props(typography.main, styles.stats)}>
          {stats.map(([label, value]) => (
            <div key={label} {...stylex.props(styles.stat)}>
              <dt {...stylex.props(styles.label)}>{label}:</dt>
              <dd {...stylex.props(styles.value)}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {isOwn ? (
        <Button xstyle={styles.primary} onClick={openLogout}>
          Log out
        </Button>
      ) : (
        <Button
          xstyle={styles.primary}
          disabled={follows.isPending(profile.user.id)}
          aria-pressed={follows.isFollowing(profile.user.id)}
          onClick={() => follows.toggle(profile.user.id)}
        >
          {follows.isFollowing(profile.user.id) ? 'Unfollow' : 'Follow'}
        </Button>
      )}
      {upload.isPending && <p role="status">Uploading avatar…</p>}
    </aside>
  );
}
