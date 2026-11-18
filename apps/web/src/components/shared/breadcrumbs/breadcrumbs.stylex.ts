import * as stylex from '@stylexjs/stylex';

import { colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  list: {
    display: 'flex',
    gap: 8,
    color: colors.gray,
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: '18px',
    // Breadcrumbs are uppercase in every Figma frame (HOME / PROFILE, HOME / SALMON AVOCADO SALAD).
    textTransform: 'uppercase',
  },
  separator: {
    marginRight: 8,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  current: {
    color: colors.black,
  },
});
