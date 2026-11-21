import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import Loader from '@/components/shared/loader/loader';
import { useAuth } from '@/hooks/use-auth';
import type { AuthModalRedirectState } from '@/stores/auth-modal.store';

/**
 * Guards private pages: waits for the session check, then redirects guests home.
 * Sign in is opened by AuthModal once the home page is rendered (see `authModal` state).
 */
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPending } = useAuth();
  const location = useLocation();

  if (isPending) {
    return <Loader size="lg" fullscreen label="Loading..." />;
  }

  if (!isAuthenticated) {
    const redirectState: AuthModalRedirectState = {
      authModal: 'sign-in',
      from: `${location.pathname}${location.search}${location.hash}`,
    };
    return <Navigate to="/" replace state={redirectState} />;
  }

  return children;
}

export default PrivateRoute;
