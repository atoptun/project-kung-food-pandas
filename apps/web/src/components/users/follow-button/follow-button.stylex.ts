import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  compact: {
    height: { default: 34, [breakpoints.tablet]: 40 },
    paddingInline: { default: 16, [breakpoints.tablet]: 24 },
    borderColor: colors.gray,
    fontSize: { default: 12, [breakpoints.tablet]: 14 },
  },
});
