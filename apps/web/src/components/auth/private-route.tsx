import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { useAuth } from '@/hooks/use-auth';
import type { AuthModalRedirectState } from '@/stores/auth-modal.store';

const signInRedirectState: AuthModalRedirectState = { authModal: 'sign-in' };

/**
 * Guards private pages: waits for the session check, then redirects guests home.
 * Sign in is opened by AuthModal once the home page is rendered (see `authModal` state).
 */
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPending } = useAuth();

  if (isPending) {
    return <p role="status">Завантаження...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={signInRedirectState} />;
  }

  return children;
}

export default PrivateRoute;
