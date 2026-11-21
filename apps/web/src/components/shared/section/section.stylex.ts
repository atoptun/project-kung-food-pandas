import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  section: {
    paddingTop: {
      default: 32,
      [breakpoints.tablet]: 50,
      [breakpoints.desktop]: 60,
    },
    paddingBottom: {
      default: 32,
      [breakpoints.tablet]: 50,
      [breakpoints.desktop]: 60,
    },
  },
  first: {
    paddingTop: {
      default: 64,
      // [breakpoints.tablet]: 80,
      [breakpoints.desktop]: 80,
    },
  },
});
