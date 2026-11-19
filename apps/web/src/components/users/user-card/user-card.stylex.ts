import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  row: {
    display: 'flex',
    gap: { default: 16, [breakpoints.tablet]: 20 },
    minWidth: 0,
    alignItems: 'flex-start',
  },
  userInfo: {
    display: 'flex',
    gap: { default: 16, [breakpoints.tablet]: 20 },
    flexGrow: 1,
    minWidth: 0,
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: { default: 14, [breakpoints.tablet]: 20 },
    lineHeight: { default: '20px', [breakpoints.tablet]: '24px' },
    fontWeight: 700,
    textTransform: 'uppercase',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleLink: { color: 'inherit', textDecoration: 'none' },
  userCopy: { minWidth: 0 },
  recipeCount: {
    marginTop: 4,
    color: colors.gray,
    fontSize: { default: 12, [breakpoints.tablet]: 14 },
    lineHeight: { default: '18px', [breakpoints.tablet]: '20px' },
  },
  previews: {
    display: { default: 'none', [breakpoints.tablet]: 'flex' },
    gap: { default: 0, [breakpoints.tablet]: 12 },
    flexShrink: 0,
  },
  preview: { width: 100, height: 100, borderRadius: 20, overflow: 'hidden' },
  fourthPreview: { display: { default: 'none', [breakpoints.desktop]: 'block' } },
  circle: {
    width: { default: 36, [breakpoints.tablet]: 42 },
    height: { default: 36, [breakpoints.tablet]: 42 },
    padding: 0,
    borderColor: colors.gray,
  },
  followButton: { marginTop: 8 },
});
