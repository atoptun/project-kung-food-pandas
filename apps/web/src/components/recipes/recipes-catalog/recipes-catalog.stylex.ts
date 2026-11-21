import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  section: {
    paddingTop: {
      default: 64,
      [breakpoints.tablet]: 100,
      [breakpoints.desktop]: 120,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateAreas: {
      default: `
        "top"
        "filters"
        "recipes"
      `,
      [breakpoints.desktop]: `
        "top top"
        "filters recipes"
      `,
    },
    gridTemplateColumns: {
      default: '1fr',
      [breakpoints.desktop]: '330px 1fr',
    },
    gap: {
      default: 32,
      [breakpoints.tablet]: 40,
      [breakpoints.desktop]: 40,
    },
    alignItems: 'start',
  },
  topArea: {
    gridArea: 'top',
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 16, [breakpoints.tablet]: 20 },
    alignItems: 'flex-start',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    padding: 0,
    // marginBottom: { default: 24, [breakpoints.tablet]: 32 },
    cursor: 'pointer',
    color: colors.black,
    transition: 'opacity 0.2s ease',
    opacity: { default: 1, ':hover': 0.7 },
  },
  backIcon: {
    transform: 'rotate(225deg)',
  },
  backText: {
    textTransform: 'uppercase',
  },
  filtersArea: {
    gridArea: 'filters',
    width: '100%',
  },
  recipesArea: {
    gridArea: 'recipes',
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 60 },
    minWidth: 0,
    width: '100%',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 16px',
    textAlign: 'center',
    gap: 16,
    color: colors.darkGray,
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 16px',
    textAlign: 'center',
    gap: 16,
    color: colors.darkGray,
  },
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: { default: 16, [breakpoints.tablet]: 24 },
  },
});
