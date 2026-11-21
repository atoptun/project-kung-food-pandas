import * as stylex from '@stylexjs/stylex';

import spriteUrl from '@/assets/icons/sprite.svg?no-inline';
import { breakpoints } from '@/styles/tokens.stylex';

const styles = stylex.create({
  icon: {
    display: 'block',
    flexShrink: 0,
    width: { default: 16, [breakpoints.tablet]: 18 },
    height: { default: 16, [breakpoints.tablet]: 18 },
  },
  size: (size: number) => ({ width: size, height: size }),
});

type IconProps = {
  name:
    | 'arrow-up-right'
    | 'burger'
    | 'check'
    | 'chevron-down'
    | 'chevron-up'
    | 'cross'
    | 'eye-off'
    | 'eye-on'
    | 'facebook'
    | 'heart'
    | 'instagram'
    | 'minus'
    | 'no-image'
    | 'photo-frame'
    | 'plus'
    | 'trash'
    | 'upload-photo'
    | 'user'
    | 'youtube'
    | 'quote';
  size?: number;
  xstyle?: stylex.StyleXStyles;
};

export default function Icon({ name, size, xstyle }: IconProps) {
  return (
    <svg
      {...stylex.props(styles.icon, size !== undefined && styles.size(size), xstyle)}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`${spriteUrl}#${name}`} />
    </svg>
  );
}
