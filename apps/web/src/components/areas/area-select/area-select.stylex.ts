import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  field: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    minWidth: 0,
    width: { default: '100%', [breakpoints.tablet]: 330 },
    maxWidth: '100%',
  },
  status: {
    margin: 0,
    color: colors.black,
  },
  control: {
    height: 56,
  },
});
