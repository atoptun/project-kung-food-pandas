import * as stylex from '@stylexjs/stylex';

import { radii } from '@/styles/tokens.stylex';

export const styles = stylex.create({
  // react-hot-toast wraps the message in its own centered block; reset it to plain text.
  message: {
    flexGrow: 1,
    margin: 0,
    textAlign: 'start',
  },
  dismiss: {
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    width: 28,
    height: 28,
    marginInlineStart: 12,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    borderRadius: radii.circle,
    outlineColor: 'currentColor',
    outlineWidth: { default: 0, ':focus-visible': 2 },
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
});
