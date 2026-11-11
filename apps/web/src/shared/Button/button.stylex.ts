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
    borderWidth: 0,
    borderStyle: 'solid',
    paddingBlock: 0,
    paddingInline: 39,
    gap: 8,
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: { default: 14, [breakpoints.tablet]: 16 },
    lineHeight: { default: '20px', [breakpoints.tablet]: '24px' },
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    height: {
      default: 48,
      [breakpoints.tablet]: 56,
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    outlineColor: colors.darkGray,
    outlineOffset: 3,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  fullWidth: {
    width: '100%',
  },
  circle: {
    width: { default: 36, [breakpoints.tablet]: 42 },
    height: { default: 36, [breakpoints.tablet]: 42 },
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: 30,
    // Figma uses an inside stroke, so it does not add to the button size.
    borderWidth: 0,
    boxShadow: {
      default: `inset 0 0 0 1px ${colors.border}`,
      ':hover': 'none',
      ':disabled': `inset 0 0 0 1px ${colors.border}`,
    },
    backgroundColor: { default: 'transparent', ':hover': colors.black, ':disabled': 'transparent' },
    color: { default: colors.black, ':hover': colors.white, ':disabled': colors.black },
    opacity: { default: 1, ':disabled': 0.5 },
  },
});

export const variants = stylex.create({
  solid: {
    backgroundColor: {
      default: colors.darkGray,
      ':hover': colors.black,
      ':disabled': colors.gray,
    },
    color: colors.white,
  },
  outline: {
    paddingInline: 32,
    backgroundColor: { default: 'transparent', ':hover': colors.black, ':disabled': 'transparent' },
    color: { default: colors.darkGray, ':hover': colors.white, ':disabled': colors.darkGray },
    boxShadow: `inset 0 0 0 1px ${colors.darkGray}`,
    opacity: { default: 1, ':disabled': 0.5 },
  },
  inverse: {
    paddingInline: 32,
    backgroundColor: { default: 'transparent', ':hover': colors.white, ':disabled': 'transparent' },
    color: { default: colors.white, ':hover': colors.black, ':disabled': colors.white },
    boxShadow: `inset 0 0 0 1px ${colors.white}`,
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: colors.white,
  },
});
