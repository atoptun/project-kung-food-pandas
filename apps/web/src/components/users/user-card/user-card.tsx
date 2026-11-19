import type { UserFollowersListResponse } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { Link } from 'react-router';

import Avatar from '@/components/shared/avatar/avatar';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import ResponsiveImage from '@/components/shared/responsive-image/responsive-image';
import { typography } from '@/styles/typography.stylex';

import FollowButton from '../follow-button/follow-button';
import { styles } from './user-card.stylex';

export type UserCardEntry = UserFollowersListResponse['items'][number];

export default function UserCard({
  entry: { user, recipesCount, topRecipes },
  followAction,
}: {
  entry: UserCardEntry;
  followAction?: Pick<
    ComponentProps<typeof FollowButton>,
    'isFollowing' | 'isPending' | 'onToggle'
  >;
}) {
  return (
    <article {...stylex.props(styles.row)}>
      <div {...stylex.props(styles.userInfo)}>
        <Link to={`/user/${user.id}`} aria-label={`View profile: ${user.name}`}>
          <Avatar src={user.avatar} alt="" size="md" />
        </Link>
        <div {...stylex.props(styles.userCopy)}>
          <h3 {...stylex.props(styles.userName)}>
            <Link to={`/user/${user.id}`} {...stylex.props(styles.titleLink)}>
              {user.name}
            </Link>
          </h3>
          <p {...stylex.props(typography.main, styles.recipeCount)}>Own recipes: {recipesCount}</p>
          {followAction && (
            <FollowButton variant="compact" xstyle={styles.followButton} {...followAction} />
          )}
        </div>
      </div>
      <div {...stylex.props(styles.previews)}>
        {topRecipes.map((recipe, index) => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            aria-label={`View recipe: ${recipe.title}`}
            {...stylex.props(index === 3 && styles.fourthPreview)}
          >
            <ResponsiveImage
              src={recipe.thumb}
              alt=""
              preset={{ desktop: 'recipePreview' }}
              wrapperXstyle={styles.preview}
            />
          </Link>
        ))}
      </div>
      <Button
        to={`/user/${user.id}`}
        variant="outline"
        shape="circle"
        xstyle={styles.circle}
        aria-label={`View profile: ${user.name}`}
      >
        <Icon name="arrow-up-right" />
      </Button>
    </article>
  );
}
