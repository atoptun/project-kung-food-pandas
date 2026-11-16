import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';
import { Link } from 'react-router';

import { shapes, styles, variants } from './button.stylex';

type ButtonAppearance = {
  variant?: keyof typeof variants;
  xstyle?: stylex.StyleXStyles;
} & ({ shape?: 'default'; fullWidth?: boolean } | { shape: 'circle'; fullWidth?: false });

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'className' | 'style'> & {
  to?: never;
};

type LinkButtonProps = Omit<ComponentPropsWithRef<typeof Link>, 'className' | 'style' | 'type'> & {
  type?: never;
  disabled?: never;
};

type ButtonProps = ButtonAppearance & (NativeButtonProps | LinkButtonProps);

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

  if (props.to !== undefined) {
    return <Link {...props} {...appearance} />;
  }

  return <button {...props} {...appearance} type={props.type ?? 'button'} />;
}

export default Button;
