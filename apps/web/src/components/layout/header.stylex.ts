import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors, radii } from '@/styles/tokens.stylex';

export type HeaderTheme = 'light' | 'dark';

// Values follow the Figma layout (mobile 375 / tablet 768 / desktop 1440).
export const header = stylex.create({
  base: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'background-color 0.25s ease, box-shadow 0.25s ease, border-radius 0.25s ease',
  },
  // Home page: header sits on top of the dark hero card that the page continues below.
  // When at top, bottom corners are square so it seamlessly connects to the hero.
  // When scrolling down, it acts like a floating dark capsule above the content.
  dark: {
    top: { default: 8, [breakpoints.tablet]: 16, [breakpoints.desktop]: 20 },
    marginTop: { default: 8, [breakpoints.tablet]: 16, [breakpoints.desktop]: 20 },
    marginInline: { default: 8, [breakpoints.tablet]: 16, [breakpoints.desktop]: 20 },
    backgroundColor: colors.black,
    color: colors.white,
    borderTopLeftRadius: { default: radii.modalMobile, [breakpoints.tablet]: radii.modal },
    borderTopRightRadius: { default: radii.modalMobile, [breakpoints.tablet]: radii.modal },
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: 'none',
  },
  darkScrolled: {
    borderBottomLeftRadius: { default: radii.modalMobile, [breakpoints.tablet]: radii.modal },
    borderBottomRightRadius: { default: radii.modalMobile, [breakpoints.tablet]: radii.modal },
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.28)',
  },
  light: {
    top: { default: 8, [breakpoints.tablet]: 16, [breakpoints.desktop]: 20 },
    marginTop: { default: 8, [breakpoints.tablet]: 16, [breakpoints.desktop]: 20 },
    marginInline: { default: 8, [breakpoints.tablet]: 16, [breakpoints.desktop]: 20 },
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(12px)',
    color: colors.black,
    borderRadius: { default: radii.modalMobile, [breakpoints.tablet]: radii.modal },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(5, 5, 5, 0.08)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
  },
  // Tablet+: three columns keep the navigation centred regardless of logo / user bar widths.
  // Mobile has no navigation, so a plain flex row gives the actions all the free space.
  bar: {
    display: { default: 'flex', [breakpoints.tablet]: 'grid' },
    justifyContent: 'space-between',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    justifyItems: 'start',
    columnGap: 16,
  },
  center: {
    gridColumn: '2',
  },
  lightBar: {
    paddingBlock: { default: 16, [breakpoints.tablet]: 20 },
    paddingInline: { default: 16, [breakpoints.tablet]: 32, [breakpoints.desktop]: 60 },
  },
  darkBar: {
    paddingBlock: { default: 16, [breakpoints.tablet]: 20 },
    paddingInline: { default: 16, [breakpoints.tablet]: 32, [breakpoints.desktop]: 60 },
  },
  actions: {
    gridColumn: '3',
    justifySelf: 'end',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    // Mobile header row is 38px tall in the design even when the user pill is 32px.
    minHeight: 38,
  },
  sessionPlaceholder: {
    display: 'block',
    width: { default: 122, [breakpoints.tablet]: 148 },
    height: { default: 32, [breakpoints.tablet]: 50 },
  },
  burger: {
    display: { default: 'grid', [breakpoints.tablet]: 'none' },
    placeItems: 'center',
    width: 28,
    height: 28,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    borderRadius: 4,
    outlineColor: 'currentColor',
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
});

export const logo = stylex.create({
  link: {
    flexShrink: 0,
    fontWeight: 800,
    fontSize: { default: 20, [breakpoints.tablet]: 24 },
    lineHeight: { default: '24px', [breakpoints.tablet]: '28px' },
    letterSpacing: '-0.02em',
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: 4,
    outlineColor: 'currentColor',
    outlineOffset: 4,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
});

export const nav = stylex.create({
  // Guests see the navigation on desktop only.
  desktopOnly: {
    display: { default: 'none', [breakpoints.desktop]: 'block' },
  },
  // Signed-in users see it from tablet up (mobile uses the burger menu).
  tabletUp: {
    display: { default: 'none', [breakpoints.tablet]: 'block' },
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    gap: { default: 16, [breakpoints.desktop]: 40 },
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  // Mobile menu: equal-width pills in a column.
  column: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 24,
  },
  link: {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    height: 46,
    paddingInline: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    color: 'inherit',
    textDecoration: 'none',
    textTransform: 'uppercase',
    outlineColor: 'currentColor',
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  // Mobile menu items: 14/20, 48px pills.
  linkLarge: {
    display: 'flex',
    justifyContent: 'center',
    height: 48,
    fontSize: 14,
    lineHeight: '20px',
  },
  linkLight: {
    borderColor: { default: 'transparent', ':hover': colors.gray },
  },
  linkDark: {
    borderColor: { default: 'transparent', ':hover': colors.overlayLight },
  },
  activeLight: {
    borderColor: colors.gray,
  },
  activeDark: {
    borderColor: colors.white,
  },
  activeMenu: {
    borderColor: colors.gray,
  },
});

export const authBar = stylex.create({
  group: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.white,
  },
  groupLight: {
    boxShadow: `inset 0 0 0 1px ${colors.black}`,
  },
  button: {
    boxSizing: 'border-box',
    height: { default: 38, [breakpoints.tablet]: 46 },
    paddingBlock: 0,
    borderRadius: radii.pill,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    outlineColor: colors.black,
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  signIn: {
    paddingInline: { default: 16, [breakpoints.tablet]: 30 },
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.black,
  },
  // Figma strokes sit inside the 104px box, so the 1px border is taken from the padding.
  signUp: {
    paddingInline: { default: 15, [breakpoints.tablet]: 27 },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.gray,
    backgroundColor: colors.darkGray,
    color: colors.white,
  },
});

export const userBar = stylex.create({
  wrapper: {
    position: 'relative',
  },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    height: { default: 32, [breakpoints.tablet]: 50 },
    padding: 0,
    paddingInlineEnd: { default: 6, [breakpoints.tablet]: 14 },
    borderWidth: 0,
    borderRadius: radii.pill,
    backgroundColor: colors.darkGray,
    color: colors.white,
    textTransform: 'uppercase',
    cursor: 'pointer',
    outlineColor: colors.gray,
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  name: {
    maxWidth: { default: 56, [breakpoints.tablet]: 120 },
    marginInlineStart: 6,
    marginInlineEnd: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  menu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    zIndex: 20,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    margin: 0,
    padding: 16,
    listStyle: 'none',
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.white,
    backgroundColor: colors.darkGray,
    color: colors.white,
  },
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'inherit',
    textDecoration: 'none',
    textTransform: 'uppercase',
    cursor: 'pointer',
    opacity: { default: 1, ':hover': 0.7 },
    outlineColor: colors.white,
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
});

export const mobileMenu = stylex.create({
  panel: {
    position: 'fixed',
    inset: 0,
    zIndex: 900,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: colors.black,
    color: colors.white,
    outlineStyle: 'none',
  },
  // Same spot as the page header on the hero card (8px card margin + 16px padding).
  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingTop: 24,
    paddingInline: 24,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    minHeight: 38,
  },
  close: {
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.white,
    cursor: 'pointer',
    borderRadius: 4,
    outlineColor: colors.white,
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  // Design: the links column starts 258px from the top of the screen (62px header + 196px).
  nav: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 196,
    paddingBottom: 40,
  },
});
