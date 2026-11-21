import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors, fonts, fontWeights, transitions } from '@/styles/tokens.stylex';

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
    textDecoration: 'none',
    opacity: {
      default: 1,
      ':hover': 0.8,
    },
    transition: {
      default: transitions.interactive,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
  },
  buttonDetails: {
    display: 'inline-flex',
    gap: 16,
    alignSelf: 'flex-start',
    borderRadius: 30,
    outlineColor: colors.darkGray,
    outlineOffset: 3,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: colors.gray,
    fontFamily: fonts.family,
    fontWeight: fontWeights.medium,
    letterSpacing: '-0.02em',
    fontSize: { default: 12, [breakpoints.tablet]: 14 },
    lineHeight: { default: '18px', [breakpoints.tablet]: '20px' },
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
  nameDetails: {
    letterSpacing: '-0.02em',
  },
});
