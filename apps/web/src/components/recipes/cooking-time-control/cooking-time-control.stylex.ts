import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  control: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  step: {
    borderColor: colors.gray,
  },
  value: {
    position: 'relative',
    width: 58,
    flexShrink: 0,
  },
  input: {
    width: '100%',
    height: { default: 48, [breakpoints.tablet]: 56 },
    padding: 0,
    borderWidth: 0,
    borderRadius: 4,
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: colors.black,
    '::placeholder': { color: colors.gray },
    appearance: 'textfield',
    '::-webkit-inner-spin-button': { appearance: 'none', margin: 0 },
    '::-webkit-outer-spin-button': { appearance: 'none', margin: 0 },
    outlineStyle: 'none',
    boxShadow: { default: 'none', ':focus': `0 1px 0 ${colors.black}` },
  },
  withUnit: {
    paddingInlineEnd: 24,
  },
  unit: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
});
