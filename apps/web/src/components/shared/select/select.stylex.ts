import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  select: {
    height: {
      default: 48,
      [breakpoints.tablet]: 56,
    },
    width: '100%',
    minWidth: 0,
    paddingBlock: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 16,
    outlineStyle: 'none',
    boxSizing: 'border-box',
    color: colors.darkGray,
    borderRadius: '30px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.gray,
    paddingInline: {
      default: 14,
      [breakpoints.tablet]: 18,
    },
    backgroundColor: { default: 'transparent', ':disabled': 'transparent' },
    opacity: { default: 1, ':disabled': 0.5 },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
  },
  active: {
    borderColor: colors.black,
  },
  icon: {
    marginInlineStart: 'auto',
    flexShrink: 0,
  },
  valueText: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'start',
  },
  placeholder: {
    color: colors.gray,
  },
  toggle: {
    position: 'absolute',
    boxSizing: 'border-box',
    margin: 0,
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingInline: 18,
    paddingBlock: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    boxShadow: `0 4px 20px ${colors.gray}`,
    overflowY: 'auto',
  },
  toggleMaxHeight: (height: string | number | undefined) => ({
    maxHeight: height,
  }),
  option: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    flexShrink: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    backgroundColor: {
      ':hover': colors.gray,
    },
    color: {
      ':hover': colors.white,
    },
    cursor: 'pointer',
  },
});
