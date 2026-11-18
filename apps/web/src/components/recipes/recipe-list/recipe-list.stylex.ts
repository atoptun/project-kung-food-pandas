import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  list: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      [breakpoints.tablet]: 'repeat(2, minmax(0, 1fr))',
      [breakpoints.desktop]: 'repeat(3, minmax(0, 1fr))',
    },
    gridGap: {
      default: '32px',
      [breakpoints.tablet]: '40px 20px',
    },
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  item: {
    display: 'flex',
    minWidth: 0,
  },
});
