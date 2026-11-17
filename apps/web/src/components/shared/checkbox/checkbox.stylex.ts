import * as stylex from '@stylexjs/stylex';

import { colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  wrapper: {
    display: 'inline-grid',
    verticalAlign: 'middle',
    opacity: { default: 1, [stylex.when.descendant(':disabled')]: 0.5 },
  },
  checkmark: {
    gridArea: '1 / 1',
    alignSelf: 'center',
    justifySelf: 'center',
    width: 10,
    height: 8,
    color: colors.white,
    pointerEvents: 'none',
    opacity: {
      default: 0,
      [stylex.when.anySibling(':checked')]: 1,
    },
  },
  checkbox: {
    gridArea: '1 / 1',
    appearance: 'none',
    display: 'inline-block',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
    flexShrink: 0,
    width: 18,
    height: 18,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: 6,
    boxShadow: { default: `inset 0 0 0 1px ${colors.border}`, ':checked': 'none' },
    backgroundColor: { default: 'transparent', ':checked': colors.black },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    outlineColor: colors.black,
    outlineOffset: 3,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: { default: 0, ':focus-visible': 2 },
  },
});
