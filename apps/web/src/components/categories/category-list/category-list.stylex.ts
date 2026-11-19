import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  grid: {
    display: 'grid',
    gap: { default: 16, [breakpoints.tablet]: 20 },
    gridTemplateColumns: {
      default: '1fr',
      [breakpoints.tablet]: 'repeat(2, 1fr)',
      [breakpoints.desktop]: 'repeat(15, minmax(0, 1fr))',
    },
    marginTop: { default: 32, [breakpoints.tablet]: 40 },
  },

  // 1. Вузька на десктопі (span 4), звичайна на таблеті (span 1)
  itemDefault: {
    gridColumn: {
      default: 'span 1',
      [breakpoints.tablet]: 'span 1',
      [breakpoints.desktop]: 'span 4',
    },
  },

  // 2. Широка І на таблеті (span 2), І на десктопі (span 7) — це індекси 2 і 7
  itemWideBoth: {
    gridColumn: {
      default: 'span 1',
      [breakpoints.tablet]: 'span 2',
      [breakpoints.desktop]: 'span 7',
    },
  },

  // 3. Широка тільки на десктопі (span 7), але звичайна на таблеті (span 1) — це індекси 3 і 9
  itemWideDesktopOnly: {
    gridColumn: {
      default: 'span 1',
      [breakpoints.tablet]: 'span 1',
      [breakpoints.desktop]: 'span 7',
    },
  },

  hiddenOnMobile: {
    display: {
      default: 'none',
      [breakpoints.tablet]: 'flex',
    },
  },
});
