import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors, radii } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  region: {
    position: 'fixed',
    zIndex: 1100,
    insetInline: 16,
    bottom: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: { default: 'stretch', [breakpoints.tablet]: 'flex-end' },
    gap: 8,
    pointerEvents: 'none',
  },
  toast: {
    pointerEvents: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: { default: '100%', [breakpoints.tablet]: 400 },
    paddingBlock: 14,
    paddingInlineStart: 20,
    paddingInlineEnd: 12,
    borderRadius: radii.card,
    borderWidth: 1,
    borderStyle: 'solid',
    boxShadow: `0 4px 20px ${colors.overlayDark}`,
  },
  error: {
    backgroundColor: colors.black,
    borderColor: colors.black,
    color: colors.white,
  },
  success: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    color: colors.black,
  },
  message: {
    flexGrow: 1,
    margin: 0,
  },
  dismiss: {
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    width: 28,
    height: 28,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    borderRadius: radii.circle,
    outlineColor: 'currentColor',
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
});
