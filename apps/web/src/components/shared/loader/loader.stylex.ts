import * as stylex from '@stylexjs/stylex';

import { colors } from '@/styles/tokens.stylex';

const spin = stylex.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    width: '100%',
    paddingBlock: 40,
  },
  fullscreen: {
    width: '100%',
    minHeight: '60vh',
  },
  spinner: {
    borderRadius: '50%',
    borderStyle: 'solid',
    animationName: spin,
    animationDuration: '0.8s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
  sizeSm: {
    width: 24,
    height: 24,
    borderWidth: 2,
  },
  sizeMd: {
    width: 40,
    height: 40,
    borderWidth: 3,
  },
  sizeLg: {
    width: 64,
    height: 64,
    borderWidth: 4,
  },
  colorDark: {
    borderColor: colors.border,
    borderTopColor: colors.black,
  },
  colorLight: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: colors.white,
  },
  srOnly: {
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
