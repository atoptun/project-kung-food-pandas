import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 40 },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 40 },
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20,
  },
  messageTitle: {
    margin: 0,
    color: colors.black,
    textTransform: 'uppercase',
  },
  messageText: {
    margin: 0,
    color: colors.darkGray,
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
  },
});
