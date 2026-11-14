import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

import Icon from '@/components/shared/icon/icon';

import { styles } from './checkbox.stylex';

type CheckboxProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'style' | 'type' | 'children'
> & {
  xstyle?: stylex.StyleXStyles;
};

export default function Checkbox({ xstyle, ...props }: CheckboxProps) {
  return (
    <span {...stylex.props(styles.wrapper)}>
      <input
        {...props}
        type="checkbox"
        {...stylex.props(stylex.defaultMarker(), styles.checkbox, xstyle)}
      />
      <Icon name="check" xstyle={styles.checkmark} />
    </span>
  );
}
