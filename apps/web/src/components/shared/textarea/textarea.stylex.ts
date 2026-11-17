import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  wrapper: {
    position: 'relative',
    paddingBlockEnd: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: {
      default: colors.gray,
      ':focus-within': colors.black,
      [stylex.when.descendant(':not(:placeholder-shown)')]: colors.black,
    },
  },
  textarea: {
    backgroundColor: 'transparent',
    paddingBlock: 0,
    paddingInlineStart: 2,
    paddingInlineEnd: {
      default: 74,
      [breakpoints.tablet]: 98,
    },
    borderWidth: 0,
    color: colors.darkGray,
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
  toggle: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  span: {
    color: colors.gray,
  },
});
