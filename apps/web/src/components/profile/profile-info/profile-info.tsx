import type { CurrentUserProfileResponse, UserPublicProfileResponse } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';
import { type ChangeEvent, useRef } from 'react';

import { useAvatarUpload, type useFollows } from '@/api/users/users.queries';
import Avatar from '@/components/shared/avatar/avatar';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import Loader from '@/components/shared/loader/loader';
import FollowButton from '@/components/users/follow-button/follow-button';
import { notify } from '@/lib/notify';
import { useAuthModalStore } from '@/stores/auth-modal.store';
import { typography } from '@/styles/typography.stylex';

import { AVATAR_FILE_ERROR, AVATAR_TYPES, MAX_AVATAR_BYTES } from '../profile.constants';
import { styles } from './profile-info.stylex';

export default function ProfileInfo({
  profile,
  isOwn,
  follows,
  xstyle,
}: {
  profile: CurrentUserProfileResponse | UserPublicProfileResponse;
  isOwn: boolean;
  follows: ReturnType<typeof useFollows>;
  xstyle?: stylex.StyleXStyles;
}) {
  const input = useRef<HTMLInputElement>(null);
  const { upload, isPending: isUploading } = useAvatarUpload(profile.user.id);
  const openLogout = useAuthModalStore((state) => state.openLogout);

  const stats = [
    ['Email', profile.user.email],
    ['Added recipes', profile.recipesCount],
    ...('favoritesCount' in profile ? [['Favorites', profile.favoritesCount]] : []),
    ['Followers', profile.followersCount],
    ...('followingCount' in profile ? [['Following', profile.followingCount]] : []),
  ];

  const profileId = profile.user.id;

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file || isUploading) return;

    if (!AVATAR_TYPES.includes(file.type) || file.size > MAX_AVATAR_BYTES) {
      notify.error(AVATAR_FILE_ERROR);
      return;
    }

    upload(file);
  }

  return (
    <aside
      {...stylex.props(xstyle)}
      aria-label={isOwn ? 'Your profile' : `${profile.user.name}'s profile`}
    >
      <div {...stylex.props(styles.info)}>
        <div {...stylex.props(styles.avatar)}>
          <Avatar src={profile.user.avatar} alt={profile.user.name} size="lg" />
          {isUploading && (
            <div {...stylex.props(styles.avatarOverlay)}>
              <Loader size="sm" label="Uploading avatar…" />
            </div>
          )}
          {isOwn && (
            <>
              <input
                ref={input}
                type="file"
                accept={AVATAR_TYPES.join(',')}
                aria-label="Avatar image"
                {...stylex.props(styles.hiddenInput)}
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                aria-label="Change avatar"
                disabled={isUploading}
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
        'isFollowing' in profile && (
          <FollowButton
            xstyle={styles.primary}
            isFollowing={profile.isFollowing}
            isPending={follows.isPending(profileId)}
            onToggle={() => follows.toggle(profileId, profile.isFollowing)}
          />
        )
      )}
    </aside>
  );
}
