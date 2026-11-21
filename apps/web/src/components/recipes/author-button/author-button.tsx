import * as stylex from '@stylexjs/stylex';

import AuthBaseButton from '@/components/shared/auth-base-button/auth-base-button';
import Avatar from '@/components/shared/avatar/avatar';
import { typography, weights } from '@/styles/typography.stylex';

import { styles } from './author-button.stylex';

export interface AuthorButtonAuthor {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface AuthorButtonProps {
  author: AuthorButtonAuthor;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  withLabel?: boolean;
  xstyle?: stylex.StyleXStyles;
}

export function AuthorButton({ author, size, withLabel = false, xstyle }: AuthorButtonProps) {
  const authorHref = `/user/${author.id}`;
  const avatarSize = size ?? (withLabel ? 'sm' : 'xs');

  return (
    <AuthBaseButton
      to={authorHref}
      aria-label={withLabel ? `Created by: ${author.name}` : `View ${author.name}'s profile`}
      {...stylex.props(
        styles.button,
        stylex.defaultMarker(),
        withLabel && styles.buttonDetails,
        xstyle,
      )}
    >
      <Avatar src={author.avatar} alt={withLabel ? '' : author.name} size={avatarSize} />
      {withLabel ? (
        <span {...stylex.props(styles.textContainer)}>
          <span {...stylex.props(styles.label)}>Created by:</span>
          <span {...stylex.props(typography.mainBold, styles.name, styles.nameDetails)}>
            {author.name}
          </span>
        </span>
      ) : (
        <span {...stylex.props(typography.main, weights.bold, styles.name)}>{author.name}</span>
      )}
    </AuthBaseButton>
  );
}

export default AuthorButton;
