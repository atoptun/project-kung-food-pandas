import * as stylex from '@stylexjs/stylex';
import { NavLink } from 'react-router';

import { typography } from '@/styles/typography.stylex';

import { type HeaderTheme, nav } from './header.stylex';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/recipe/add', label: 'Add recipe', end: false },
] as const;

type NavProps = {
  'aria-label': string;
  theme: HeaderTheme;
  /** `menu` renders the large vertical variant used in the mobile menu. */
  variant?: 'header' | 'menu';
  xstyle?: stylex.StyleXStyles;
  onNavigate?: () => void;
};

function Nav({ 'aria-label': ariaLabel, theme, variant = 'header', xstyle, onNavigate }: NavProps) {
  const isDark = theme === 'dark';
  const isMenu = variant === 'menu';
  const activeStyle = isMenu ? nav.activeMenu : isDark ? nav.activeDark : nav.activeLight;

  return (
    <nav aria-label={ariaLabel} {...stylex.props(xstyle)}>
      <ul {...stylex.props(nav.list, isMenu && nav.column)}>
        {NAV_ITEMS.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                stylex.props(
                  typography.captionBold,
                  nav.link,
                  isMenu && nav.linkLarge,
                  isDark ? nav.linkDark : nav.linkLight,
                  isActive && activeStyle,
                ).className ?? ''
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
