import * as stylex from '@stylexjs/stylex';

import { breakpoints, fonts, fontWeights } from './tokens.stylex';

export const weights = stylex.create({
  medium: { fontWeight: fontWeights.medium },
  bold: { fontWeight: fontWeights.bold },
  extraBold: { fontWeight: fontWeights.extraBold },
});

export const typography = stylex.create({
  h1: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.extraBold,
    letterSpacing: '-0.02em',
    fontSize: {
      default: 40,
      [breakpoints.tablet]: 70,
      [breakpoints.desktop]: 90,
    },
    lineHeight: {
      default: '40px',
      [breakpoints.tablet]: '70px',
      [breakpoints.desktop]: '90px',
    },
  },
  h2: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.extraBold,
    letterSpacing: '-0.02em',
    fontSize: {
      default: 28,
      [breakpoints.tablet]: 40,
    },
    lineHeight: {
      default: '32px',
      [breakpoints.tablet]: '44px',
    },
  },
  h3: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.extraBold,
    letterSpacing: '-0.02em',
    fontSize: {
      default: 18,
      [breakpoints.tablet]: 24,
    },
    lineHeight: {
      default: '24px',
      [breakpoints.tablet]: '28px',
    },
  },
  h4: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.bold,
    letterSpacing: '-0.02em',
    fontSize: {
      default: 18,
      [breakpoints.tablet]: 20,
    },
    lineHeight: {
      default: '22px',
      [breakpoints.tablet]: '24px',
    },
  },
  main: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.medium,
    fontSize: {
      default: 14,
      [breakpoints.tablet]: 16,
    },
    lineHeight: {
      default: '20px',
      [breakpoints.tablet]: '24px',
    },
  },
  mainBold: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.bold,
    fontSize: {
      default: 14,
      [breakpoints.tablet]: 16,
    },
    lineHeight: {
      default: '20px',
      [breakpoints.tablet]: '24px',
    },
  },
  button: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    fontSize: {
      default: 14,
      [breakpoints.tablet]: 16,
    },
    lineHeight: {
      default: '18px',
      [breakpoints.tablet]: '24px',
    },
  },
  caption: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.medium,
    fontSize: 12,
    lineHeight: '18px',
  },
  captionBold: {
    fontFamily: fonts.family,
    fontWeight: fontWeights.bold,
    fontSize: 12,
    lineHeight: '18px',
  },
});
