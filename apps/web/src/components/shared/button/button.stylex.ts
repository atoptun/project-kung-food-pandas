import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    flexShrink: 0,
    borderRadius: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingBlock: 0,
    paddingInline: 32,
    gap: 8,
    fontFamily: 'inherit',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    height: { default: 48, [breakpoints.tablet]: 56 },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    outlineColor: colors.darkGray,
    outlineOffset: 3,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  link: {
    textDecoration: 'none',
  },
  fullWidth: {
    width: '100%',
  },
  circle: {
    width: { default: 48, [breakpoints.tablet]: 56 },
    paddingInline: 0,
    paddingBlock: 0,
  },
});

export const shapes = stylex.create({
  circle: {
    width: { default: 48, [breakpoints.tablet]: 56 },
    paddingInline: 0,
    paddingBlock: 0,
  },
});

export const variants = stylex.create({
  solid: {
    backgroundColor: {
      default: colors.darkGray,
      ':not(:disabled):hover': 'transparent',
      ':disabled': colors.gray,
    },
    borderColor: {
      default: 'transparent',
      ':not(:disabled):hover': colors.darkGray,
      ':disabled': 'transparent',
    },
    color: {
      default: colors.white,
      ':not(:disabled):hover': colors.black,
    },
  },
  outline: {
    paddingInline: 32,
    backgroundColor: {
      default: 'transparent',
      ':not(:disabled):hover': colors.black,
      ':disabled': 'transparent',
    },
    color: {
      default: colors.darkGray,
      ':not(:disabled):hover': colors.white,
      ':disabled': colors.darkGray,
    },
    borderColor: colors.darkGray,
    opacity: { default: 1, ':disabled': 0.5 },
  },
  inverse: {
    paddingInline: 32,
    backgroundColor: {
      default: 'transparent',
      ':not(:disabled):hover': colors.white,
      ':disabled': 'transparent',
    },
    color: {
      default: colors.white,
      ':not(:disabled):hover': colors.black,
      ':disabled': colors.white,
    },
    borderColor: colors.white,
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: colors.white,
  },
});
