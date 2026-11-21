import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

import { breakpoints, colors } from '@/styles/tokens.stylex';
import { typography } from '@/styles/typography.stylex';

const styles = stylex.create({
  subtitle: {
    color: colors.darkGray,
    margin: 0,
    maxWidth: { default: '100%', [breakpoints.tablet]: 530 },
    opacity: 0.8,
  },
});

type SubtitleProps = {
  children: ReactNode;
  xstyle?: stylex.StyleXStyles;
};

export function Subtitle({ children, xstyle }: SubtitleProps) {
  return <p {...stylex.props(typography.main, styles.subtitle, xstyle)}>{children}</p>;
}

export default Subtitle;
