import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headingWithBreadcrumbs: {
    marginTop: { default: 32, [breakpoints.tablet]: 40 },
  },
  subtitle: {
    marginTop: { default: 16, [breakpoints.tablet]: 20 },
    maxWidth: { default: 343, [breakpoints.tablet]: 530 },
  },
});
