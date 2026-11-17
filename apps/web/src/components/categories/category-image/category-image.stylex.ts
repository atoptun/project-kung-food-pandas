import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  picture: {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: {
      default: 250,
      [breakpoints.tablet]: 369,
      // [breakpoints.desktop]: 369,
    },
    borderRadius: {
      default: 20,
      [breakpoints.tablet]: 30,
    },
    overflow: 'hidden',
  },
  img: {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});
