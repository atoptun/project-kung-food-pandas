import * as stylex from '@stylexjs/stylex';

import type { AuthBaseButtonProps } from '@/components/shared/auth-base-button/auth-base-button';
import AuthBaseButton from '@/components/shared/auth-base-button/auth-base-button';

import { shapes, styles, variants } from './button.stylex';

type ButtonAppearance = {
  variant?: keyof typeof variants;
  xstyle?: stylex.StyleXStyles;
} & ({ shape?: 'default'; fullWidth?: boolean } | { shape: 'circle'; fullWidth?: false });

type ButtonProps = ButtonAppearance & AuthBaseButtonProps;

function Button({
  variant = 'solid',
  fullWidth = false,
  xstyle,
  shape = 'default',
  ...props
}: ButtonProps) {
  const appearance = stylex.props(
    styles.button,
    variants[variant],
    fullWidth && styles.fullWidth,
    shape !== 'default' && shapes[shape],
    props.to !== undefined && styles.link,
    xstyle,
  );

  return <AuthBaseButton {...props} {...appearance} />;
}

export default Button;
