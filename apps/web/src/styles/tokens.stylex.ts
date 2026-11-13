import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  black: '#050505',
  darkGray: '#1A1A1A',
  gray: '#BFBEBE',
  white: '#FFFFFF',
  border: '#E8E8E8',
});

// Base styles cover the fluid mobile layout from 320px.
export const breakpoints = stylex.defineConsts({
  mobile: '@media (min-width: 375px)',
  tablet: '@media (min-width: 768px)',
  desktop: '@media (min-width: 1440px)',
});
