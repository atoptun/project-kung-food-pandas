import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  wrapper: {
    position: 'relative',
  },
  select: {
    height: {
      default: 48,
      [breakpoints.tablet]: 56,
    },
    width: '100%',
    minWidth: 176,
    paddingBlock: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 16,
    outlineStyle: 'none',
    boxSizing: 'border-box',
    color: colors.darkGray,
    borderRadius: '30px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.gray,
    paddingInline: {
      default: 14,
      [breakpoints.tablet]: 18,
    },
    backgroundColor: { default: 'transparent', ':disabled': 'transparent' },
    opacity: { default: 1, ':disabled': 0.5 },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
  },
  active: {
    borderColor: colors.black,
  },
  icon: {
    marginInlineStart: 'auto',
  },
  placeholder: {
    color: colors.gray,
  },
  toggle: {
    position: 'absolute',
    boxSizing: 'border-box',
    margin: 0,
    insetInlineEnd: {
      default: '14px',
      [breakpoints.tablet]: '18px',
    },
    top: 'calc(100% + 8px)',
    left: 0,
    width: {
      default: 'min(342px, calc(100vw - 32px))',
      [breakpoints.tablet]: 315,
    },
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingInline: 18,
    paddingBlock: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    boxShadow: `0 4px 20px ${colors.gray}`,
  },
  option: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    backgroundColor: {
      ':hover': colors.gray,
    },
    color: {
      ':hover': colors.white,
    },
    cursor: 'pointer',
  },
});
