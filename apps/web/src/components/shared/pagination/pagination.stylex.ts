import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  list: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  button: {
    width: { default: 40, [breakpoints.tablet]: 40 },
    height: { default: 40, [breakpoints.tablet]: 40 },
    padding: 0,
    borderRadius: '50%',
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400,
    letterSpacing: 'normal',
    backgroundColor: {
      default: 'transparent',
      ':not(:disabled):hover': 'transparent',
      ':disabled': 'transparent',
    },
    color: {
      default: colors.darkGray,
      ':not(:disabled):hover': colors.darkGray,
    },
    borderColor: {
      default: 'transparent',
      ':not(:disabled):hover': colors.gray,
    },
  },
  current: {
    borderColor: {
      default: colors.darkGray,
      ':not(:disabled):hover': colors.darkGray,
    },
    cursor: 'default',
  },
});
