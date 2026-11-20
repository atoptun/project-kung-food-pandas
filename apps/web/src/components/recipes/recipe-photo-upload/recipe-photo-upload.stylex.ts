import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  field: {
    minWidth: 0,
  },
  frameWrapper: {
    position: 'relative',
    height: { default: 318, [breakpoints.tablet]: 400 },
    width: '100%',
    color: colors.gray,
  },
  photo: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 30,
  },
  frame: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    overflow: 'visible',
    pointerEvents: 'none',
  },
  empty: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  upload: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: { default: 'transparent', ':hover': colors.lightGray },
    color: colors.black,
    textDecoration: 'underline',
    cursor: 'pointer',
    outlineColor: colors.black,
    outlineOffset: 3,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  replace: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 16,
  },
  error: {
    margin: 0,
    marginTop: 8,
    color: colors.error,
  },
});
