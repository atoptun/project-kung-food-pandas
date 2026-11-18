import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  form: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [breakpoints.desktop]: '551px minmax(0, 649px)',
    },
    alignItems: 'start',
    gap: { default: 32, [breakpoints.tablet]: 40, [breakpoints.desktop]: 80 },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 64, [breakpoints.tablet]: 80 },
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
  },
  groups: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 60 },
  },
  name: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 40 },
  },
  metadata: {
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [breakpoints.tablet]: '315px 194px' },
    gap: { default: 32, [breakpoints.tablet]: 20 },
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 0,
  },
  title: {
    textTransform: 'uppercase',
    height: { default: 24, [breakpoints.tablet]: 28 },
    borderBottomWidth: 0,
    borderRadius: 0,
    padding: 0,
    outlineStyle: 'none',
    boxShadow: { default: 'none', ':focus': `0 1px 0 ${colors.black}` },
  },
  textarea: {
    display: 'block',
    maxHeight: 'none',
    outlineStyle: 'none',
  },
  textareaWrapper: {
    borderBottomWidth: { default: 1, ':focus-within': 2 },
    borderBottomColor: { default: colors.gray, ':focus-within': colors.black },
    paddingBottom: { default: 16, ':focus-within': 15 },
  },
  label: {
    display: 'block',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    display: 'block',
    margin: 0,
    textTransform: 'uppercase',
  },
  preparation: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 40 },
  },
  actions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  error: {
    margin: 0,
    color: colors.black,
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
