import * as stylex from '@stylexjs/stylex';
import { type ComponentPropsWithoutRef, useState } from 'react';

import eyeOffIcon from '@/assets/icons/eye-off.svg';
import eyeOnIcon from '@/assets/icons/eye-on.svg';
import Icon from '@/shared/Icon/Icon';

import { styles, variants } from './input.stylex';

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'style'> & {
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
          <Icon src={isPasswordVisible ? eyeOnIcon : eyeOffIcon} />
        </button>
      )}
    </div>
  );
}

export default Input;
