import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  black: '#050505',
  darkGray: '#1A1A1A',
  gray: '#BFBEBE',
  lightGray: '#EEEEEE',
  white: '#FFFFFF',
  border: '#E8E8E8',
  overlayDark: 'rgba(5, 5, 5, 0.2)',
  overlayLight: 'rgba(255, 255, 255, 0.2)',
});

export const radii = stylex.defineConsts({
  pill: 30,
  card: 16,
  modal: 30,
  modalMobile: 24,
  circle: '50%',
});

export const breakpoints = stylex.defineConsts({
  mobile: '@media (min-width: 375px)',
  tablet: '@media (min-width: 768px)',
  desktop: '@media (min-width: 1440px)',
});

export const fonts = stylex.defineConsts({
  family: "'Mulish', sans-serif",
});

export const fontWeights = stylex.defineConsts({
  medium: 500,
  bold: 700,
  extraBold: 800,
});
