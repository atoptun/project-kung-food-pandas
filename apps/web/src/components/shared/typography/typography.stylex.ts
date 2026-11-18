import * as stylex from '@stylexjs/stylex';

import { colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  base: {
    margin: 0,
  },
  // Text alignments
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  // Text transforms
  uppercase: {
    textTransform: 'uppercase',
  },
  // Color presets from design tokens
  colorBlack: {
    color: colors.black,
  },
  colorDarkGray: {
    color: colors.darkGray,
  },
  colorGray: {
    color: colors.gray,
  },
  colorLightGray: {
    color: colors.lightGray,
  },
  colorWhite: {
    color: colors.white,
  },
});
