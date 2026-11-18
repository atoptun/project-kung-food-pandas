import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  container: {
    display: 'grid',
    gap: 14,
    gridTemplateColumns: {
      default: '1fr',
      [breakpoints.tablet]: 'repeat(2, minmax(0, 1fr))',
      [breakpoints.desktop]: '1fr',
    },
    width: '100%',
  },
  control: {
    width: '100%',
  },
});
