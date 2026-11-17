import * as stylex from '@stylexjs/stylex';
import { type ComponentPropsWithRef, useState } from 'react';

import Icon from '@/components/shared/icon/icon';

import { styles, variants } from './input.stylex';

type InputProps = Omit<ComponentPropsWithRef<'input'>, 'className' | 'style'> & {
  variant?: keyof typeof variants;
  xstyle?: stylex.StyleXStyles;
};

function Input({ variant = 'outline', xstyle, type = 'text', ...props }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  return (
    <div {...stylex.props(styles.wrapper)}>
      <input
        {...props}
        type={inputType}
        {...stylex.props(
          stylex.defaultMarker(),
          styles.input,
          variants[variant],
          isPassword && styles.withToggle,
          xstyle,
        )}
      />

      {isPassword && (
        <button
          type="button"
          {...stylex.props(styles.toggle)}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isPasswordVisible}
          disabled={props.disabled}
          onClick={() => setIsPasswordVisible((visible) => !visible)}
        >
          <Icon name={isPasswordVisible ? 'eye-on' : 'eye-off'} />
        </button>
      )}
    </div>
  );
}

export default Input;
