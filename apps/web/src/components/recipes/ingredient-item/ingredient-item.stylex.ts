import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  item: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    gap: {
      default: 10,
      [breakpoints.tablet]: 14,
    },
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    borderRadius: 15,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: {
      default: 10,
      [breakpoints.tablet]: 15,
    },
    width: {
      default: 75,
      [breakpoints.tablet]: 90,
    },
    height: {
      default: 75,
      [breakpoints.tablet]: 90,
    },
  },
  picture: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: {
      default: 55,
      [breakpoints.tablet]: 60,
    },
    height: {
      default: 55,
      [breakpoints.tablet]: 60,
    },
  },
  image: {
    display: 'block',
    width: {
      default: 55,
      [breakpoints.tablet]: 60,
    },
    height: {
      default: 55,
      [breakpoints.tablet]: 60,
    },
    objectFit: 'contain',
    objectPosition: 'center',
  },
  noImage: {
    color: colors.gray,
  },
  placeholderIcon: {
    color: colors.gray,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 2,
    minWidth: 0,
    flexGrow: 1,
  },
  name: {
    margin: 0,
    color: colors.black,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  measure: {
    margin: 0,
    color: colors.gray,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    borderColor: 'transparent',
    padding: 0,
    cursor: 'pointer',
    color: colors.black,
    outlineColor: colors.darkGray,
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    opacity: { default: 1, ':hover': 0.7, ':disabled': 0.4 },
  },
});
