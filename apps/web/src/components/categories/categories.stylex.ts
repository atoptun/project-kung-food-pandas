import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  section: {
    paddingTop: {
      default: 64,
      [breakpoints.tablet]: 100,
      [breakpoints.desktop]: 120,
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
});
