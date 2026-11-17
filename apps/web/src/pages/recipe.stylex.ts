import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

// Values follow the Figma "Recipe" frames (mobile 375 / tablet 768 / desktop 1440).
export const styles = stylex.create({
  page: {
    paddingTop: { default: 64, [breakpoints.desktop]: 80 },
  },
  section: {
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
