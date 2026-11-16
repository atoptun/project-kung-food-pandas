import * as stylex from '@stylexjs/stylex';

import { useAuthModalStore } from '@/stores/auth-modal.store';
import { typography } from '@/styles/typography.stylex';

import { authBar, type HeaderTheme } from './header.stylex';

function AuthBar({ theme }: { theme: HeaderTheme }) {
  const openSignIn = useAuthModalStore((state) => state.openSignIn);
  const openSignUp = useAuthModalStore((state) => state.openSignUp);

  return (
    <div {...stylex.props(authBar.group, theme === 'light' && authBar.groupLight)}>
      <button
        type="button"
        {...stylex.props(typography.captionBold, authBar.button, authBar.signIn)}
        onClick={openSignIn}
      >
        Sign in
      </button>
      <button
        type="button"
        {...stylex.props(typography.captionBold, authBar.button, authBar.signUp)}
        onClick={openSignUp}
      >
        Sign up
      </button>
    </div>
  );
}

export default AuthBar;
