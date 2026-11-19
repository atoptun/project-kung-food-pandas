import * as stylex from '@stylexjs/stylex';
import { useNavigate } from 'react-router';

import AuthBaseButton from '@/components/auth-base-button/auth-base-button';
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
  size?: 'sm' | 'md' | 'lg';
  xstyle?: stylex.StyleXStyles;
}

export function AuthorButton({ author, size = 'sm', xstyle }: AuthorButtonProps) {
  const navigate = useNavigate();
  const authorHref = `/user/${author.id}`;

  return (
    <AuthBaseButton
      requireAuth
      onClick={() => void navigate(authorHref)}
      aria-label={`View ${author.name}'s profile`}
      {...stylex.props(styles.button, xstyle)}
    >
      <Avatar src={author.avatar} alt={author.name} size={size} />
      <span {...stylex.props(typography.main, weights.bold, styles.name)}>{author.name}</span>
    </AuthBaseButton>
  );
}

export default AuthorButton;
