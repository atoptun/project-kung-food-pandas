import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors, radii } from '@/styles/tokens.stylex';

export const hero = stylex.create({
  card: {
    marginInline: { default: 8, [breakpoints.tablet]: 16, [breakpoints.desktop]: 20 },
    backgroundColor: colors.black,
    color: colors.white,
    borderBottomLeftRadius: { default: radii.modalMobile, [breakpoints.tablet]: radii.modal },
    borderBottomRightRadius: { default: radii.modalMobile, [breakpoints.tablet]: radii.modal },
    paddingTop: { default: 60, [breakpoints.tablet]: 80, [breakpoints.desktop]: 100 },
    paddingBottom: { default: 50, [breakpoints.tablet]: 70, [breakpoints.desktop]: 90 },
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: { default: '100%', [breakpoints.tablet]: 640, [breakpoints.desktop]: 890 },
    marginInline: 'auto',
  },
  title: {
    color: colors.white,
    margin: 0,
    textTransform: 'uppercase',
  },
  description: {
    color: colors.white,
    margin: 0,
    marginTop: { default: 20, [breakpoints.tablet]: 28, [breakpoints.desktop]: 40 },
    marginBottom: { default: 32, [breakpoints.tablet]: 40, [breakpoints.desktop]: 40 },
    maxWidth: { default: 335, [breakpoints.tablet]: 530, [breakpoints.desktop]: 580 },
    opacity: 0.8,
  },
  button: {
    minWidth: 160,
  },
});
