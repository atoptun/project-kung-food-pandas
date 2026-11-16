import { useId } from 'react';

import Modal from '@/components/shared/modal/modal';
import { useAuthModalStore } from '@/stores/auth-modal.store';

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
