import * as stylex from '@stylexjs/stylex';

import { colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  checkbox: (checkmark: string) => ({
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
    backgroundImage: checkmark,
    backgroundSize: { default: '0 0', ':checked': '10px 8px' },
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: colors.black,
    outlineOffset: 3,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: { default: 0, ':focus-visible': 2 },
  }),
});
