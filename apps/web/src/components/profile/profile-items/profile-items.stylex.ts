import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: { default: 32, [breakpoints.tablet]: 60 },
  },
  message: {
    minHeight: 200,
    paddingBlock: { default: 60, [breakpoints.tablet]: 100 },
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  messageText: { maxWidth: 620 },
  listMessage: { marginTop: { default: 32, [breakpoints.tablet]: 40 } },
});
