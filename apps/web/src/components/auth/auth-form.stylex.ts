import * as stylex from '@stylexjs/stylex';

import { breakpoints, colors } from '@/styles/tokens.stylex';

// Values follow the Figma auth modals (mobile 343px / tablet & desktop 560px).
const sectionGap = { default: 32, [breakpoints.tablet]: 40 } as const;

export const styles = stylex.create({
  title: {
    margin: 0,
    marginBottom: sectionGap,
    fontWeight: 800,
    fontSize: { default: 28, [breakpoints.tablet]: 32 },
    lineHeight: { default: '32px', [breakpoints.tablet]: '40px' },
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    color: colors.black,
  },
  centered: {
    textAlign: 'center',
  },
  titleTight: {
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: sectionGap,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  error: {
    margin: 0,
    paddingInline: { default: 14, [breakpoints.tablet]: 18 },
    color: colors.black,
  },
  invalid: {
    borderColor: colors.black,
  },
  apiError: {
    margin: 0,
    marginBottom: 16,
    color: colors.black,
    textAlign: 'center',
  },
  switchText: {
    margin: 0,
    marginTop: { default: 16, [breakpoints.tablet]: 20 },
    fontWeight: 500,
    fontSize: { default: 12, [breakpoints.tablet]: 14 },
    lineHeight: '18px',
    letterSpacing: '-0.02em',
    textAlign: 'center',
    color: colors.gray,
  },
  switchButton: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.black,
    font: 'inherit',
    cursor: 'pointer',
    textDecoration: { default: 'none', ':hover': 'underline' },
    outlineColor: colors.black,
    outlineOffset: 2,
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  description: {
    margin: 0,
    marginBottom: sectionGap,
    textAlign: 'center',
    color: colors.darkGray,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 16, [breakpoints.tablet]: 20 },
  },
  confirmButton: {
    backgroundColor: {
      default: colors.black,
      ':not(:disabled):hover': 'transparent',
      ':disabled': colors.gray,
    },
  },
  visuallyHidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});
