import * as stylex from '@stylexjs/stylex';
import { type ComponentPropsWithRef, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router';

import { authClient } from '@/lib/auth-client';
import { useAuthModalStore } from '@/stores/auth-modal.store';

import { styles } from './auth-base-button.stylex';

type BaseProps = {
  requireAuth?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type NativeAuthButtonProps = Omit<ComponentPropsWithRef<'button'>, 'className' | 'style'> &
  BaseProps & {
    to?: never;
  };

export type LinkAuthButtonProps = Omit<
  ComponentPropsWithRef<typeof Link>,
  'className' | 'style' | 'type'
> &
  BaseProps & {
    to: string;
    type?: never;
    disabled?: never;
  };

export type AuthBaseButtonProps = NativeAuthButtonProps | LinkAuthButtonProps;

function AuthBaseButton(props: AuthBaseButtonProps) {
  const openSignIn = useAuthModalStore((state) => state.openSignIn);
  const { data: session } = authClient.useSession();
  const isAuthenticated = Boolean(session);
  const navigate = useNavigate();

  const { requireAuth, ...restProps } = props;

  const reset = stylex.props(styles.buttonReset);
  const className = [reset.className, props.className].filter(Boolean).join(' ');
  const style = { ...reset.style, ...props.style };

  if (restProps.to !== undefined) {
    const { to, onClick, ...linkProps } = restProps;

    if (requireAuth && !isAuthenticated) {
      const {
        ref: _anchorRef,
        type: _anchorType,
        relative: _relative,
        reloadDocument: _reloadDocument,
        replace: _replace,
        state: _state,
        preventScrollReset: _preventScrollReset,
        ...buttonHtmlProps
      } = linkProps as ComponentPropsWithRef<typeof Link>;

      return (
        <button
          {...(buttonHtmlProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          type="button"
          aria-haspopup="dialog"
          className={className}
          style={style}
          onClick={(e) => {
            e.preventDefault();
            onClick?.(e as unknown as MouseEvent<HTMLAnchorElement>);
            openSignIn(() => void navigate(to));
          }}
        />
      );
    }

    // Logged in user: render <Link>
    return <Link to={to} {...linkProps} onClick={onClick} />;
  }

  // Simple button
  const { onClick, type = 'button', ...buttonProps } = restProps;

  return (
    <button
      {...buttonProps}
      type={type}
      aria-haspopup={requireAuth && !isAuthenticated ? 'dialog' : undefined}
      className={className}
      style={style}
      onClick={(e) => {
        if (requireAuth && !isAuthenticated) {
          openSignIn(() => onClick?.(e));
          return;
        }
        onClick?.(e);
      }}
    />
  );
}

export default AuthBaseButton;
