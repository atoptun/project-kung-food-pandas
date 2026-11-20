import type { StyleXStyles } from '@stylexjs/stylex';

import Button from '@/components/shared/button/button';

import { styles } from './follow-button.stylex';

export default function FollowButton({
  isFollowing,
  isPending,
  onToggle,
  variant = 'solid',
  xstyle,
}: {
  isFollowing: boolean;
  isPending: boolean;
  onToggle: () => void;
  variant?: 'solid' | 'compact';
  xstyle?: StyleXStyles;
}) {
  const compact = variant === 'compact';

  return (
    <Button
      variant={compact ? 'outline' : 'solid'}
      xstyle={[compact && styles.compact, xstyle]}
      disabled={isPending}
      aria-pressed={isFollowing}
      onClick={onToggle}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
