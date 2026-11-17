import { MutationCache, QueryClient } from '@tanstack/react-query';

import { notify } from '@/lib/notify';
import { getErrorMessage } from '@/utils/error-message';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Skip the global error notification (the component shows its own error). */
      silent?: boolean;
    };
  }
}

export const CACHE_TIMES = {
  DEFAULT_STALE: 1000 * 60 * 5, // 5 minute
  DEFAULT_GC: 1000 * 60 * 30, // 30 minute
  STATIC_DATA_STALE: 1000 * 60 * 15, // 15 minute (dictionaries)
  STATIC_DATA_GC: 1000 * 60 * 60, // 1 hour (dictionaries)
} as const;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_TIMES.DEFAULT_STALE,
        gcTime: CACHE_TIMES.DEFAULT_GC,
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
