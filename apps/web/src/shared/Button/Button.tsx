import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { styles, variants } from './button.stylex';

type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'style'> & {
  variant?: keyof typeof variants;
  fullWidth?: boolean;
  xstyle?: stylex.StyleXStyles;
};

function ButtonRoot({
  variant = 'solid',
  fullWidth = false,
  xstyle,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      {...stylex.props(styles.button, variants[variant], fullWidth && styles.fullWidth, xstyle)}
      type={type}
    >
      {children}
    </button>
  );
}

type CircleButtonProps = Omit<ButtonProps, 'children' | 'aria-label' | 'fullWidth' | 'variant'> & {
  children: ReactElement;
  'aria-label': string;
};

function CircleButton({ children, xstyle, ...props }: CircleButtonProps) {
  return (
    <ButtonRoot {...props} variant="outline" xstyle={[styles.circle, xstyle]}>
      {children}
    </ButtonRoot>
  );
}

// Public names used by React DevTools and Storybook's generated JSX examples.
const Button = Object.assign(ButtonRoot, {
  displayName: 'Button',
  Circle: Object.assign(CircleButton, { displayName: 'Button.Circle' }),
});

export default Button;
