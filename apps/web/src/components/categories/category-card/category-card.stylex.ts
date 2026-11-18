import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors, radii } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  card: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    padding: 0,
    borderWidth: 0,
    backgroundColor: colors.overlayDark,
    cursor: 'pointer',
    textAlign: 'left',
    outlineColor: colors.black,
    outlineOffset: 4,
    borderRadius: { default: 20, [breakpoints.tablet]: radii.modal },
  },
  imageWrapper: {
    width: '100%',
    height: { default: 250, [breakpoints.tablet]: 369 },
    borderRadius: { default: 20, [breakpoints.tablet]: 30 },
    overflow: 'hidden',
    backgroundColor: colors.overlayDark,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: { default: 20, [breakpoints.tablet]: 30 },
    backgroundColor: colors.overlayDark,
    pointerEvents: 'none',
    zIndex: 1,
  },
  allCategoriesWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: { default: 250, [breakpoints.tablet]: 369 },
    borderRadius: { default: 20, [breakpoints.tablet]: 30 },
    backgroundColor: colors.black,
  },
  allCategoriesText: {
    color: colors.white,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: { default: 16, [breakpoints.tablet]: 24 },
    left: { default: 16, [breakpoints.tablet]: 24 },

    display: 'flex',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  titleWrapper: {
    paddingBlock: { default: 7, [breakpoints.tablet]: 9 },
    paddingInline: { default: 12, [breakpoints.tablet]: 14 },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.white,
    borderRadius: 30,
    backgroundColor: colors.overlayLight,
  },
  title: {
    color: colors.white,
  },
  arrowButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: { default: 40, [breakpoints.tablet]: 44 },
    height: { default: 40, [breakpoints.tablet]: 44 },
    borderRadius: '50%',

    borderWidth: 1,
    borderStyle: 'solid',
    // borderColor: colors.bgLight,

    color: colors.white,
    backgroundColor: {
      default: 'transparent',
      [stylex.when.ancestor(':hover')]: colors.black,
      [stylex.when.ancestor(':focus-visible')]: colors.black,
    },
    borderColor: {
      default: colors.overlayLight,
      [stylex.when.ancestor(':hover')]: colors.black,
      [stylex.when.ancestor(':focus-visible')]: colors.black,
    },
    transform: {
      default: 'scale(1)',
      [stylex.when.ancestor(':hover')]: 'scale(1.05)',
    },
    transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
  },
});
