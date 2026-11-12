import * as stylex from '@stylexjs/stylex';
import { type ComponentPropsWithoutRef } from 'react';

import { styles } from './textarea.stylex';

type TextareaProps = Omit<
  ComponentPropsWithoutRef<'textarea'>,
  'className' | 'style' | 'value' | 'defaultValue'
> & {
  value?: string;
  xstyle?: stylex.StyleXStyles;
  maxLength?: number;
};
function Textarea({ xstyle, maxLength = 1000, value = '', ...props }: TextareaProps) {
  return (
    <div {...stylex.props(styles.wrapper)}>
      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        {...stylex.props(stylex.defaultMarker(), styles.textarea, xstyle)}
      />

      <div {...stylex.props(styles.toggle)}>
        {value.length}/<span {...stylex.props(styles.span)}>{maxLength}</span>
      </div>
    </div>
  );
}

export default Textarea;
