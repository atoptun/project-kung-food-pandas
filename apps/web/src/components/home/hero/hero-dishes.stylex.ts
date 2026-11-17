import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const composition = stylex.create({
  wrapper: {
    containerType: 'inline-size',
    position: 'relative',
    marginInline: 'auto',
    marginTop: { default: 32, [breakpoints.tablet]: 44, [breakpoints.desktop]: 50 },
    width: '100%',
    maxWidth: { default: 311, [breakpoints.tablet]: 502 },
    aspectRatio: {
      default: '311 / 208',
      [breakpoints.tablet]: '502 / 330',
    },
    overflow: 'visible',
  },
  inner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: { default: 311, [breakpoints.tablet]: 502 },
    height: { default: 208, [breakpoints.tablet]: 330 },
    transformOrigin: 'top left',
    transform: {
      default: 'scale(min(1, calc(100cqw / 311px)))',
      [breakpoints.tablet]: 'scale(min(1, calc(100cqw / 502px)))',
    },
  },
  dishSmall: {
    position: 'absolute',
    left: { default: 6, [breakpoints.tablet]: 10 },
    top: { default: 99, [breakpoints.tablet]: 150 },
    width: { default: 77, [breakpoints.tablet]: 128 },
    height: { default: 70, [breakpoints.tablet]: 116 },
    borderRadius: 15,
    overflow: 'hidden',
    transform: 'rotate(11deg)',
    zIndex: 1,
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.4)',
  },
  dishLarge: {
    position: 'absolute',
    left: { default: 105, [breakpoints.tablet]: 175 },
    top: { default: 18, [breakpoints.tablet]: 28 },
    width: { default: 190, [breakpoints.tablet]: 302 },
    height: { default: 172, [breakpoints.tablet]: 273 },
    borderRadius: 30,
    overflow: 'hidden',
    transform: 'rotate(-12deg)',
    zIndex: 2,
    boxShadow: '0 14px 30px rgba(0, 0, 0, 0.45)',
  },
  img: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});
