import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors, radii } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  card: {
    position: 'relative',
    width: '100%',
    minWidth: 0,
    maxWidth: 822,
    marginInline: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 16,
    marginBottom: {
      default: 32,
      [breakpoints.tablet]: 40,
    },
  },
  title: {
    margin: 0,
  },
  quoteIcon: {
    position: 'absolute',
    left: {
      default: 8,
      [breakpoints.tablet]: 40,
    },
    top: {
      default: 80,
      [breakpoints.tablet]: 76,
    },
    color: colors.overlayDark,
    width: { default: 40, [breakpoints.tablet]: 58 },
    height: { default: 32, [breakpoints.tablet]: 44 },
    pointerEvents: 'none',
  },
  slideViewport: {
    width: '100%',
    overflow: 'hidden',
  },
  slideTrack: (activeIndex: number) => ({
    display: 'flex',
    width: '100%',
    transform: `translateX(-${activeIndex * 100}%)`,
    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    willChange: 'transform',
  }),
  slideWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    minWidth: '100%',
    flexShrink: 0,
    boxSizing: 'border-box',
    paddingInline: 16,
  },
  testimonialText: {
    fontSize: { default: 18, [breakpoints.tablet]: 24 },
    lineHeight: { default: 1.33, [breakpoints.tablet]: 1.5 },
    marginTop: { default: 32, [breakpoints.tablet]: 32 },
    marginBottom: { default: 64, [breakpoints.tablet]: 40 },
    // maxWidth: { default: 343, [breakpoints.tablet]: 640, [breakpoints.desktop]: 780 },
  },
  authorName: {
    marginBottom: { default: 32, [breakpoints.tablet]: 40 },
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: radii.circle,
    borderStyle: 'none',
    borderWidth: 0,
    padding: 0,
    cursor: 'pointer',
    backgroundColor: colors.overlayDark,
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  },
  dotActive: {
    backgroundColor: colors.black,
  },
});
