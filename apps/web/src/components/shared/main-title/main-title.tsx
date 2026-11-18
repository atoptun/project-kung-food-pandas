import * as stylex from '@stylexjs/stylex';
import type { ElementType, ReactNode } from 'react';

import { colors } from '@/styles/tokens.stylex';
import { typography } from '@/styles/typography.stylex';

const styles = stylex.create({
  title: {
    color: colors.black,
    textTransform: 'uppercase',
    margin: 0,
  },
});

type MainTitleProps = {
  variant?: ElementType;
  children: ReactNode;
  xstyle?: stylex.StyleXStyles;
};

export function MainTitle({ variant: Component = 'h2', children, xstyle }: MainTitleProps) {
  return <Component {...stylex.props(typography.h2, styles.title, xstyle)}>{children}</Component>;
}

export default MainTitle;
