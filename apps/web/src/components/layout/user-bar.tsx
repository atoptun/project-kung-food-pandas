import * as stylex from '@stylexjs/stylex';
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';

import Avatar from '@/components/shared/avatar/avatar';
import Icon from '@/components/shared/icon/icon';
import type { AuthSessionUser } from '@/lib/auth-client';
import { useAuthModalStore } from '@/stores/auth-modal.store';
import { typography } from '@/styles/typography.stylex';

import { userBar } from './header.stylex';

type UserBarProps = {
  user: Pick<AuthSessionUser, 'id' | 'name' | 'image'>;
};

function UserBar({ user }: UserBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const openLogout = useAuthModalStore((state) => state.openLogout);

  useEffect(() => {
    if (!isOpen) return;

    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [isOpen]);

  const closeMenu = (returnFocus = false) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    const index = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === 'Tab') {
      closeMenu();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    }
  };

  return (
    <div
      ref={wrapperRef}
      {...stylex.props(userBar.wrapper)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        {...stylex.props(typography.captionBold, userBar.trigger)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <Avatar src={user.image} alt="" size="sm" />
        <span {...stylex.props(userBar.name)}>{user.name}</span>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} />
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Account"
          {...stylex.props(typography.captionBold, userBar.menu)}
          onKeyDown={handleMenuKeyDown}
        >
          <li role="none">
            <Link
              role="menuitem"
              to={`/user/${user.id}`}
              {...stylex.props(userBar.item)}
              onClick={() => closeMenu()}
            >
              Profile
            </Link>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              {...stylex.props(userBar.item)}
              onClick={() => {
                closeMenu();
                openLogout();
              }}
            >
              Log out
              <Icon name="arrow-up-right" size={16} />
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default UserBar;
