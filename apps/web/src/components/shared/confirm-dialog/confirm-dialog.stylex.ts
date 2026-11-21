import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

const sectionGap = { default: 32, [breakpoints.tablet]: 40 } as const;

export const styles = stylex.create({
  titleTight: {
    margin: 0,
    marginBottom: 20,
  },
  description: {
    margin: 0,
    marginBottom: sectionGap,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 16, [breakpoints.tablet]: 20 },
  },
  confirmButton: {
    backgroundColor: {
      default: colors.black,
      ':not(:disabled):hover': 'transparent',
      ':disabled': colors.gray,
    },
    borderColor: {
      default: colors.black,
      ':not(:disabled):hover': colors.black,
      ':disabled': colors.gray,
    },
    color: {
      default: colors.white,
      ':not(:disabled):hover': colors.black,
      ':disabled': colors.white,
    },
  },
  dangerButton: {
    backgroundColor: {
      default: colors.error,
      ':not(:disabled):hover': 'transparent',
      ':disabled': colors.gray,
    },
    borderColor: {
      default: colors.error,
      ':not(:disabled):hover': colors.error,
      ':disabled': colors.gray,
    },
    color: {
      default: colors.white,
      ':not(:disabled):hover': colors.error,
      ':disabled': colors.white,
    },
  },
});
