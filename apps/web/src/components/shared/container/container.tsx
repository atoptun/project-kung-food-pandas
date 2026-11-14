import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  container: {
    width: '100%',
    maxWidth: {
      default: 375,
      [breakpoints.tablet]: 768,
      [breakpoints.desktop]: 1440,
    },
    marginInline: 'auto',
    paddingInline: {
      default: 16,
      [breakpoints.tablet]: 32,
      [breakpoints.desktop]: 80,
    },
  },
});

type ContainerProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  xstyle?: stylex.StyleXStyles;
};

function Container({ children, xstyle, ...props }: ContainerProps) {
  return (
    <div {...props} {...stylex.props(styles.container, xstyle)}>
      {children}
    </div>
  );
}

export default Container;
