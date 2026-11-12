import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithoutRef } from 'react';

import checkIcon from '@/assets/icons/check.svg';

import { styles } from './checkbox.stylex';

type CheckboxProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'className' | 'style' | 'type' | 'children'
> & {
  xstyle?: stylex.StyleXStyles;
};

export default function Checkbox({ xstyle, ...props }: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      {...stylex.props(styles.checkbox(`url("${checkIcon}")`), xstyle)}
    />
  );
}
