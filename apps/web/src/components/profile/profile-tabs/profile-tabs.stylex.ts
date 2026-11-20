import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  tabs: {
    display: 'flex',
    gap: { default: 30, [breakpoints.tablet]: 40 },
    overflowX: 'auto',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.gray,
  },
  tab: {
    display: 'block',
    flexShrink: 0,
    padding: 0,
    paddingBottom: 14,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    marginBottom: -1,
    color: colors.gray,
    textTransform: 'uppercase',
    fontSize: { default: 18, [breakpoints.tablet]: 20 },
    lineHeight: '24px',
    fontWeight: 700,
    cursor: 'pointer',
    outlineOffset: -3,
  },
  active: { color: colors.black, borderBottomColor: colors.black },
});
