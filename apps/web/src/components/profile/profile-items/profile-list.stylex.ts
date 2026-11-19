import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 40 },
    marginTop: { default: 32, [breakpoints.tablet]: 40 },
  },
  users: { gap: 0 },
  userRow: {
    paddingTop: { default: 20, [breakpoints.tablet]: 40 },
    paddingBottom: { default: 20, [breakpoints.tablet]: 40 },
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.gray,
  },
  firstUser: { paddingTop: 0 },
  lastUser: { paddingBottom: 0, borderBottomWidth: 0 },
});
