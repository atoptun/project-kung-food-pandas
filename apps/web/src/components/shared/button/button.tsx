import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

import { shapes, styles, variants } from './button.stylex';

type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'className' | 'style'> & {
  variant?: keyof typeof variants;
  xstyle?: stylex.StyleXStyles;
} & ({ shape?: 'default'; fullWidth?: boolean } | { shape: 'circle'; fullWidth?: false });

function Button({
  variant = 'solid',
  fullWidth = false,
  xstyle,
  children,
  type = 'button',
  shape = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      {...stylex.props(
        styles.button,
        variants[variant],
        fullWidth && styles.fullWidth,
        shape !== 'default' && shapes[shape],
        xstyle,
      )}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
