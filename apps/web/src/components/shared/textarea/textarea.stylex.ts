import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  wrapper: {
    position: 'relative',
    paddingBlockEnd: { default: 16, ':focus-within': 15 },
    borderBottomStyle: 'solid',
    borderBottomWidth: { default: 1, ':focus-within': 2 },
    borderBottomColor: {
      default: colors.gray,
      ':focus-within': colors.black,
      [stylex.when.descendant(':not(:placeholder-shown)')]: colors.black,
    },
  },
  wrapperInvalid: {
    borderBottomColor: `${colors.error} !important`,
  },
  textarea: {
    display: 'block',
    backgroundColor: 'transparent',
    paddingBlock: 0,
    paddingInlineStart: 2,
    paddingInlineEnd: {
      default: 74,
      [breakpoints.tablet]: 98,
    },
    borderWidth: 0,
    color: {
      default: colors.darkGray,
      ':invalid': colors.error,
    },

    '::placeholder': {
      color: colors.gray,
    },
    outlineStyle: 'none',
    fieldSizing: 'content',
    width: '100%',
    boxSizing: 'border-box',
    maxHeight: 356,
    overflowY: 'auto',
    resize: 'none',
  },
  textareaInvalid: {
    color: `${colors.error} !important`,
  },
  toggle: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  span: {
    color: colors.gray,
  },
});
