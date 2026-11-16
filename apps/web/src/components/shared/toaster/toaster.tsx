import * as stylex from '@stylexjs/stylex';
import {
  type DefaultToastOptions,
  resolveValue,
  toast,
  ToastBar,
  Toaster as HotToaster,
} from 'react-hot-toast';

import Icon from '@/components/shared/icon/icon';
import { colors } from '@/styles/tokens.stylex';
import { typography } from '@/styles/typography.stylex';

import { styles } from './toaster.stylex';

// react-hot-toast styles the bar with inline styles, so the container look is set here
// (StyleX classes would lose to the library's runtime CSS); inner content uses StyleX.
const toastOptions: DefaultToastOptions = {
  duration: 5000,
  style: {
    maxWidth: 400,
    padding: '14px 12px 14px 20px',
    borderRadius: 16,
    border: `1px solid ${colors.border}`,
    boxShadow: `0 4px 20px ${colors.overlayDark}`,
    background: colors.white,
    color: colors.black,
  },
  error: {
    style: { background: colors.black, borderColor: colors.black, color: colors.white },
  },
};

/** Renders notifications pushed with `notify.error()` / `notify.success()`. Mounted once in Layout. */
function Toaster() {
  return (
    <HotToaster position="bottom-right" toastOptions={toastOptions}>
      {(item) => (
        <ToastBar toast={item}>
          {() => (
            <>
              <div {...item.ariaProps} {...stylex.props(typography.main, styles.message)}>
                {resolveValue(item.message, item)}
              </div>
              <button
                type="button"
                {...stylex.props(styles.dismiss)}
                aria-label="Dismiss notification"
                onClick={() => toast.dismiss(item.id)}
              >
                <Icon name="cross" size={16} />
              </button>
            </>
          )}
        </ToastBar>
      )}
    </HotToaster>
  );
}

export default Toaster;
