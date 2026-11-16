import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import { createPortal } from 'react-dom';

import Icon from '@/components/shared/icon/icon';
import { useDialogBehavior } from '@/hooks/use-dialog-behavior';
import type { AuthSessionUser } from '@/lib/auth-client';
import { useUIStore } from '@/stores/ui.store';

import { mobileMenu } from './header.stylex';
import Logo from './logo';
import Nav from './nav';
import UserBar from './user-bar';

type MobileMenuUser = Pick<AuthSessionUser, 'id' | 'name' | 'image'>;

function MobileMenuPanel({ user, onClose }: { user: MobileMenuUser; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useDialogBehavior(panelRef, onClose);

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
      {...stylex.props(mobileMenu.panel)}
    >
      <div {...stylex.props(mobileMenu.top)}>
        <Logo onClick={onClose} />
        <div {...stylex.props(mobileMenu.actions)}>
          <UserBar user={user} />
          <button
            type="button"
            {...stylex.props(mobileMenu.close)}
            aria-label="Close menu"
            onClick={onClose}
          >
            <Icon name="cross" size={28} />
          </button>
        </div>
      </div>

      <Nav
        aria-label="Mobile"
        theme="dark"
        variant="menu"
        xstyle={mobileMenu.nav}
        onNavigate={onClose}
      />
    </div>
  );
}

/** Full-screen navigation for mobile. Open state lives in `useUIStore`. */
function MobileMenu({ user }: { user: MobileMenuUser }) {
  const isOpen = useUIStore((state) => state.isMobileMenuOpen);
  const close = useUIStore((state) => state.closeMobileMenu);

  if (!isOpen) return null;

  return createPortal(<MobileMenuPanel user={user} onClose={close} />, document.body);
}

export default MobileMenu;
