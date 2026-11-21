import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  black: '#050505',
  darkGray: '#1A1A1A',
  gray: '#BFBEBE',
  lightGray: '#EEEEEE',
  white: '#FFFFFF',
  border: '#E8E8E8',
  error: '#AE0000',
  overlayDark: 'rgba(5, 5, 5, 0.2)',
  overlayLight: 'rgba(255, 255, 255, 0.2)',
});

export const radii = stylex.defineConsts({
  pill: 30,
  card: 16,
  modal: 30,
  modalMobile: 20,
  circle: '50%',
});

export const breakpoints = stylex.defineConsts({
  mobile: '@media (min-width: 375px)',
  tablet: '@media (min-width: 768px)',
  desktop: '@media (min-width: 1440px)',
});

export const fonts = stylex.defineConsts({
  // @fontsource-variable/mulish registers the face as 'Mulish Variable'
  family: "'Mulish Variable', 'Mulish', sans-serif",
});

export const fontWeights = stylex.defineConsts({
  medium: 500,
  bold: 700,
  extraBold: 800,
});

export const transitions = stylex.defineConsts({
  fast: '0.1s ease',
  default: '0.2s ease',
  interactive:
    'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease, transform 0.1s ease',
});
