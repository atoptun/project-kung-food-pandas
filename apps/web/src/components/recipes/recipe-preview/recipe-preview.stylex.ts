import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  row: {
    display: 'flex',
    gap: { default: 10, [breakpoints.tablet]: 16 },
    minWidth: 0,
    alignItems: 'flex-start',
  },
  recipeImage: {
    width: { default: 75, [breakpoints.tablet]: 100 },
    height: { default: 75, [breakpoints.tablet]: 100 },
    borderRadius: { default: 15, [breakpoints.tablet]: 20 },
    flexShrink: 0,
    overflow: 'hidden',
  },
  recipeCopy: { minWidth: 0, flexGrow: 1 },
  recipeTitle: {
    fontSize: { default: 14, [breakpoints.tablet]: 20 },
    lineHeight: { default: '20px', [breakpoints.tablet]: '24px' },
    fontWeight: 700,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleLink: { color: 'inherit', textDecoration: 'none' },
  description: {
    marginTop: { default: 8, [breakpoints.tablet]: 10 },
    color: { default: colors.gray, [breakpoints.tablet]: colors.black },
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    overflowWrap: 'anywhere',
  },
  actions: { display: 'flex', gap: 4, flexShrink: 0 },
  circle: {
    width: { default: 36, [breakpoints.tablet]: 42 },
    height: { default: 36, [breakpoints.tablet]: 42 },
    padding: 0,
    borderColor: colors.gray,
  },
});
