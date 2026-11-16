import { useEffect, useId } from 'react';
import { useLocation, useNavigate } from 'react-router';

import Modal from '@/components/shared/modal/modal';
import { type AuthModalRedirectState, useAuthModalStore } from '@/stores/auth-modal.store';

import LogoutConfirm from './logout-confirm';
import SignInForm from './sign-in-form';
import SignUpForm from './sign-up-form';

/** The only auth dialog in the app. Open it via `useAuthModalStore` (openSignIn/openSignUp/openLogout). */
function AuthModal() {
  const titleId = useId();
  const view = useAuthModalStore((state) => state.view);
  const close = useAuthModalStore((state) => state.close);
  const openSignIn = useAuthModalStore((state) => state.openSignIn);
  const openSignUp = useAuthModalStore((state) => state.openSignUp);
  const open = useAuthModalStore((state) => state.open);

  const location = useLocation();
  const navigate = useNavigate();
  const requestedView = (location.state as AuthModalRedirectState | null)?.authModal;

  // A redirect (e.g. PrivateRoute) asked for the dialog: open it on the destination page,
  // then drop the state so Back/refresh does not reopen it.
  useEffect(() => {
    if (!requestedView) return;
    open(requestedView);
    void navigate(
      { pathname: location.pathname, search: location.search, hash: location.hash },
      { replace: true, state: null },
    );
  }, [requestedView, open, navigate, location.pathname, location.search, location.hash]);

  return (
    // `key` remounts the dialog per view so focus moves into the new form.
    <Modal key={view} isOpen={view !== null} onClose={close} aria-labelledby={titleId}>
      {view === 'sign-in' && (
        <SignInForm titleId={titleId} onSuccess={close} onSwitchToSignUp={openSignUp} />
      )}
      {view === 'sign-up' && (
        <SignUpForm titleId={titleId} onSuccess={close} onSwitchToSignIn={openSignIn} />
      )}
      {view === 'logout' && <LogoutConfirm titleId={titleId} onCancel={close} />}
    </Modal>
  );
}

export default AuthModal;
