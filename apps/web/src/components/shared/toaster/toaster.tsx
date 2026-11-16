import * as stylex from '@stylexjs/stylex';

import Icon from '@/components/shared/icon/icon';
import { useNotificationsStore } from '@/stores/notifications.store';
import { typography } from '@/styles/typography.stylex';

import { styles } from './toaster.stylex';

/** Renders notifications pushed with `notify.error()` / `notify.success()`. Mounted once in Layout. */
function Toaster() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const dismiss = useNotificationsStore((state) => state.dismiss);

  return (
    <div {...stylex.props(styles.region)} aria-live="polite">
      {notifications.map(({ id, type, message }) => (
        <div
          key={id}
          {...stylex.props(styles.toast, styles[type])}
          role={type === 'error' ? 'alert' : 'status'}
        >
          <p {...stylex.props(typography.main, styles.message)}>{message}</p>
          <button
            type="button"
            {...stylex.props(styles.dismiss)}
            aria-label="Dismiss notification"
            onClick={() => dismiss(id)}
          >
            <Icon name="cross" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toaster;
