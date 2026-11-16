import { MutationCache, QueryClient } from '@tanstack/react-query';

import { notify } from '@/stores/notifications.store';
import { getErrorMessage } from '@/utils/error-message';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Skip the global error notification (the component shows its own error). */
      silent?: boolean;
    };
  }
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
    // Queries render their own loading/error states; failed actions are reported globally.
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.silent) return;
        notify.error(getErrorMessage(error));
      },
    }),
  });
}

export const queryClient = createQueryClient();
