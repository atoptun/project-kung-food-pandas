import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  page: {
    paddingTop: { default: 64, [breakpoints.tablet]: 68, [breakpoints.desktop]: 84 },
  },
  heading: {
    marginTop: { default: 32, [breakpoints.tablet]: 40 },
  },
  subtitle: {
    color: colors.black,
    opacity: 1,
    marginTop: 16,
    maxWidth: { default: 343, [breakpoints.tablet]: 500 },
  },
  layout: {
    marginTop: { default: 32, [breakpoints.tablet]: 40 },
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [breakpoints.desktop]: '394px minmax(0, 1fr)',
    },
    alignItems: 'start',
    gap: { default: 64, [breakpoints.tablet]: 80, [breakpoints.desktop]: 40 },
  },
  sidebar: {
    width: '100%',
    maxWidth: { default: 343, [breakpoints.tablet]: 394 },
    marginInline: 'auto',
  },
  content: {
    minWidth: 0,
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
});
