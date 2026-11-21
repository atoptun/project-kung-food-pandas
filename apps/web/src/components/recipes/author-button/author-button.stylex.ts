import * as stylex from '@stylexjs/stylex';

import { colors, transitions } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    flexShrink: 1,
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    background: 'none',
    borderStyle: 'none',
    borderWidth: 0,
    cursor: 'pointer',
    color: colors.black,
    fontFamily: 'inherit',
    textAlign: 'left',
    outline: 'none',
    opacity: {
      default: 1,
      ':hover': 0.8,
    },
    transition: {
      default: transitions.interactive,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
    color: colors.black,
    textDecorationLine: {
      default: 'none',
      [stylex.when.ancestor(':hover')]: 'underline',
    },
    textUnderlineOffset: 3,
  },
});
