import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  heading: {
    margin: 0,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: { default: 32, [breakpoints.tablet]: 40 },
  },
  fields: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [breakpoints.tablet]: 'repeat(2, minmax(0, 1fr))',
    },
    gap: { default: 16, [breakpoints.tablet]: 20 },
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 0,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  measure: {
    paddingInline: 0,
    outlineStyle: 'none',
    boxShadow: { default: 'none', ':focus': `0 1px 0 ${colors.black}` },
  },
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    columnGap: { default: 16, [breakpoints.tablet]: 40 },
    rowGap: 16,
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    width: '100%',
  },
  listItem: {
    minWidth: 0,
  },
  error: {
    margin: 0,
    color: colors.error,
  },
  visuallyHidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});
