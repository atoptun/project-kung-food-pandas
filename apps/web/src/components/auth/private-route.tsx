import { type ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router';

import { useAuth } from '@/hooks/use-auth';
import { useAuthModalStore } from '@/stores/auth-modal.store';

/** Guards private pages: waits for the session check, then redirects guests home and opens Sign in. */
function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPending } = useAuth();
  const openSignIn = useAuthModalStore((state) => state.openSignIn);
  const shouldRedirect = !isPending && !isAuthenticated;

  useEffect(() => {
    if (shouldRedirect) openSignIn();
  }, [shouldRedirect, openSignIn]);

  if (isPending) {
    return <p role="status">Завантаження...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
