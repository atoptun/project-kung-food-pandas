import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

// Values follow the Figma "Recipe" frames (mobile 375 / tablet 768 / desktop 1440).
export const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 40 },
    marginTop: { default: 64, [breakpoints.tablet]: 100, [breakpoints.desktop]: 120 },
  },
  title: {
    margin: 0,
    color: colors.black,
    textTransform: 'uppercase',
  },
  list: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      [breakpoints.tablet]: 'repeat(2, minmax(0, 1fr))',
      [breakpoints.desktop]: 'repeat(4, minmax(0, 1fr))',
    },
    gap: 20,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  item: {
    display: 'flex',
    minWidth: 0,
  },
  status: {
    margin: 0,
    color: colors.darkGray,
  },
  error: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
  },
});
