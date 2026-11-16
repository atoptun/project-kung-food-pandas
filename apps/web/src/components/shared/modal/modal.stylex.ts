import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors, radii } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    overflowY: 'auto',
    backgroundColor: colors.overlayDark,
  },
  dialog: {
    position: 'relative',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 560,
    maxHeight: '100%',
    margin: 'auto',
    overflowY: 'auto',
    backgroundColor: colors.white,
    color: colors.black,
    borderRadius: { default: radii.modalMobile, [breakpoints.tablet]: radii.modal },
    paddingBlock: { default: 60, [breakpoints.tablet]: 80 },
    paddingInline: { default: 30, [breakpoints.tablet]: 80 },
    outlineStyle: 'none',
  },
  close: {
    position: 'absolute',
    top: { default: 16, [breakpoints.tablet]: 20 },
    right: { default: 16, [breakpoints.tablet]: 20 },
    display: 'grid',
    placeItems: 'center',
    // Design: 24×24 close icon placed 20px from the top/right edges (tablet & desktop).
    width: 24,
    height: 24,
    padding: 0,
    borderWidth: 0,
    borderRadius: radii.circle,
    backgroundColor: 'transparent',
    color: colors.black,
    cursor: 'pointer',
    outlineColor: colors.black,
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
});
