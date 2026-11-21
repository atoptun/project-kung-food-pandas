import { useEffect, useId } from 'react';
import { useLocation, useNavigate } from 'react-router';

import Modal from '@/components/shared/modal/modal';
import { useAuth } from '@/hooks/use-auth';
import { authClient } from '@/lib/auth-client';
import { type AuthModalRedirectState, useAuthModalStore } from '@/stores/auth-modal.store';

import LogoutConfirm from './logout-confirm';
import SignInForm from './sign-in-form';
import SignUpForm from './sign-up-form';

/** The only auth dialog in the app. Open it via `useAuthModalStore` (openSignIn/openSignUp/openLogout). */
function AuthModal() {
  const titleId = useId();
  const view = useAuthModalStore((state) => state.view);
  const redirectTo = useAuthModalStore((state) => state.redirectTo);
  const close = useAuthModalStore((state) => state.close);
  const openSignIn = useAuthModalStore((state) => state.openSignIn);
  const openSignUp = useAuthModalStore((state) => state.openSignUp);
  const open = useAuthModalStore((state) => state.open);
  const onSuccessCallback = useAuthModalStore((state) => state.onSuccess);
  const { isAuthenticated } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const redirectState = location.state as AuthModalRedirectState | null;
  const requestedView = redirectState?.authModal;
  const from = redirectState?.from;

  const handleSuccess = async () => {
    const destination = redirectTo;
    close();
    await authClient.getSession();
    if (onSuccessCallback) {
      onSuccessCallback();
    } else if (destination) {
      void navigate(destination);
    }
  };
  // A redirect (e.g. PrivateRoute) asked for the dialog: open it on the destination page,
  // then drop the state so Back/refresh does not reopen it.
  useEffect(() => {
    if (!requestedView) return;

    if (isAuthenticated) {
      void navigate(
        { pathname: location.pathname, search: location.search, hash: location.hash },
        { replace: true, state: null },
      );
      return;
    }

    open(requestedView, from);
    void navigate(
      { pathname: location.pathname, search: location.search, hash: location.hash },
      { replace: true, state: null },
    );
  }, [
    requestedView,
    from,
    isAuthenticated,
    open,
    navigate,
    location.pathname,
    location.search,
    location.hash,
  ]);

  return (
    // `key` remounts the dialog per view so focus moves into the new form.
    <Modal key={view} isOpen={view !== null} onClose={close} aria-labelledby={titleId}>
      {view === 'sign-in' && (
        <SignInForm titleId={titleId} onSuccess={handleSuccess} onSwitchToSignUp={openSignUp} />
      )}
      {view === 'sign-up' && (
        <SignUpForm titleId={titleId} onSuccess={handleSuccess} onSwitchToSignIn={openSignIn} />
      )}
      {view === 'logout' && <LogoutConfirm titleId={titleId} onCancel={close} />}
    </Modal>
  );
}

export default AuthModal;
