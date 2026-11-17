import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  wrapper: {
    position: 'relative',
  },
  withToggle: {
    paddingInlineEnd: {
      default: 46,
      [breakpoints.tablet]: 56,
    },
  },
  input: {
    backgroundColor: 'transparent',
    height: {
      default: 48,
      [breakpoints.tablet]: 56,
    },
    paddingBlock: 0,
    outlineStyle: 'none',
    width: '100%',
    boxSizing: 'border-box',
    color: colors.darkGray,
    '::placeholder': {
      color: colors.gray,
    },
  },
  toggle: {
    position: 'absolute',
    insetInlineEnd: {
      default: '14px',
      [breakpoints.tablet]: '18px',
    },
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'grid',
    placeItems: 'center',
    width: 36,
    height: 36,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: {
      default: colors.gray,
      [stylex.when.siblingBefore(':not(:placeholder-shown)')]: colors.black,
    },
    cursor: 'pointer',
  },
});

export const variants = stylex.create({
  outline: {
    borderRadius: '30px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: colors.gray,
      ':focus': colors.black,
      ':not(:placeholder-shown)': colors.black,
    },
    paddingInline: {
      default: 14,
      [breakpoints.tablet]: 18,
    },
  },
  underline: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    paddingInline: 2,
    borderBottomColor: {
      default: colors.gray,
      ':focus': colors.black,
      ':not(:placeholder-shown)': colors.black,
    },
  },
});
