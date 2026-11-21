import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors, fonts, fontWeights } from '@/styles/tokens.stylex';

// Values follow the Figma "Recipe" frames (mobile 375 / tablet 768 / desktop 1440).
export const styles = stylex.create({
  details: {
    display: 'flex',
    flexDirection: { default: 'column', [breakpoints.desktop]: 'row' },
    alignItems: { default: 'stretch', [breakpoints.desktop]: 'flex-start' },
    gap: { default: 32, [breakpoints.tablet]: 40, [breakpoints.desktop]: 80 },
  },
  imageWrapper: {
    flexShrink: 0,
    width: { default: '100%', [breakpoints.desktop]: 551 },
    height: { default: 318, [breakpoints.tablet]: 400 },
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
    color: colors.gray,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexGrow: 1,
    minWidth: 0,
    gap: { default: 32, [breakpoints.tablet]: 40 },
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: '100%',
  },
  title: {
    margin: 0,
    color: colors.black,
    textTransform: 'uppercase',
    overflowWrap: 'anywhere',
  },
  // Mobile/H3 (18/24) and Desktop_tablet/H4 (20/24), both ExtraBold uppercase.
  sectionTitle: {
    margin: 0,
    fontFamily: fonts.family,
    fontWeight: fontWeights.extraBold,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    color: colors.black,
    fontSize: { default: 18, [breakpoints.tablet]: 20 },
    lineHeight: '24px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  tag: {
    // Figma: 10px padding with an inside 1px stroke → 38px tall pill.
    padding: 9,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.gray,
    borderRadius: 30,
    color: colors.gray,
    fontFamily: fonts.family,
    fontWeight: fontWeights.medium,
    fontSize: 14,
    lineHeight: '18px',
    letterSpacing: '-0.02em',
  },
  text: {
    margin: 0,
    color: colors.black,
    overflowWrap: 'anywhere',
  },
  ingredients: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: { default: 16, [breakpoints.tablet]: 20 },
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  ingredient: {
    width: { default: 152, [breakpoints.tablet]: 178 },
  },
  // The tile has no remove button here, so it does not need the reserved right padding.
  ingredientItem: {
    paddingRight: 0,
  },
  favoriteButton: {
    height: { default: 48, [breakpoints.tablet]: 56 },
    paddingInline: { default: 20, [breakpoints.tablet]: 32 },
  },
});
