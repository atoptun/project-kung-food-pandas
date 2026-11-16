import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { clearClientSession, signOut } from '@/lib/auth-client';
import { useAuthModalStore } from '@/stores/auth-modal.store';

/**
 * Logs out and always resets the client: even if the request fails, the local session,
 * query cache and localStorage are cleared and the user lands on the home page.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const closeAuthModal = useAuthModalStore((state) => state.close);

  return async () => {
    closeAuthModal();
    // Leave private pages first so their guards do not react to the cleared session.
    await navigate('/', { replace: true });

    try {
      await signOut();
    } catch {
      // Ignored on purpose: the client session is cleared below anyway.
    } finally {
      clearClientSession();
      queryClient.clear();
      localStorage.clear();
    }
  };
}
