import * as stylex from '@stylexjs/stylex';

import Container from '@/components/shared/container/container';
import Icon from '@/components/shared/icon/icon';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui.store';

import AuthBar from './auth-bar';
import { header, type HeaderTheme, nav } from './header.stylex';
import Logo from './logo';
import MobileMenu from './mobile-menu';
import Nav from './nav';
import UserBar from './user-bar';

type HeaderProps = {
  theme?: HeaderTheme;
};

function Header({ theme = 'light' }: HeaderProps) {
  const { user, isPending } = useAuth();
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const openMobileMenu = useUIStore((state) => state.openMobileMenu);

  const isDark = theme === 'dark';

  return (
    <header {...stylex.props(header.base, isDark ? header.dark : header.light)}>
      <Container xstyle={[header.bar, isDark ? header.darkBar : header.lightBar]}>
        <Logo />

        <Nav
          aria-label="Main"
          theme={theme}
          xstyle={[header.center, user ? nav.tabletUp : nav.desktopOnly]}
        />

        <div {...stylex.props(header.actions)}>
          {isPending ? (
            // Session check in progress: neither guest nor user controls yet.
            <span
              role="status"
              aria-label="Checking session"
              {...stylex.props(header.sessionPlaceholder)}
            />
          ) : user ? (
            <>
              <UserBar user={user} />
              <button
                type="button"
                {...stylex.props(header.burger)}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                onClick={openMobileMenu}
              >
                <Icon name="burger" size={28} />
              </button>
            </>
          ) : (
            <AuthBar theme={theme} />
          )}
        </div>
      </Container>

      {user && <MobileMenu user={user} />}
    </header>
  );
}

export default Header;
