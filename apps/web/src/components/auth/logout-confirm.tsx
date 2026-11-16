import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import Button from '@/components/shared/button/button';
import { typography } from '@/styles/typography.stylex';

import { styles } from './auth-form.stylex';
import { useLogout } from './use-logout';

type LogoutConfirmProps = {
  titleId: string;
  onCancel: () => void;
};

function LogoutConfirm({ titleId, onCancel }: LogoutConfirmProps) {
  const logout = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <>
      <h2 id={titleId} {...stylex.props(styles.title, styles.centered, styles.titleTight)}>
        Are you logging out?
      </h2>
      <p {...stylex.props(typography.main, styles.description)}>
        You can always log back in at any time.
      </p>
      <div {...stylex.props(styles.actions)}>
        <Button
          fullWidth
          xstyle={styles.confirmButton}
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          Log out
        </Button>
        <Button variant="outline" fullWidth onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
}

export default LogoutConfirm;
