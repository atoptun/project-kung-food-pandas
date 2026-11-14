import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  avatar: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  wrapper: {
    display: 'inline-flex',
    flexShrink: 0,
    borderRadius: '50%',
    overflow: 'hidden',
  },
});

export const size = stylex.create({
  xs: {
    height: {
      default: 32,
      [breakpoints.tablet]: 40,
    },
    width: {
      default: 32,
      [breakpoints.tablet]: 40,
    },
  },
  sm: {
    height: {
      default: 32,
      [breakpoints.tablet]: 50,
    },
    width: {
      default: 32,
      [breakpoints.tablet]: 50,
    },
  },
  md: {
    height: {
      default: 60,
      [breakpoints.tablet]: 85,
    },
    width: {
      default: 60,
      [breakpoints.tablet]: 85,
    },
  },
  lg: {
    height: {
      default: 80,
      [breakpoints.tablet]: 120,
    },
    width: {
      default: 80,
      [breakpoints.tablet]: 120,
    },
  },
});
