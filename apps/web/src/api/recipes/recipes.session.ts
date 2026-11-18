import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useAuth } from '@/hooks/use-auth';

import { queryKeys } from '../keys';

/**
 * `isFavorite` in recipe responses depends on who is signed in, so cached recipes are refetched
 * whenever the session user changes (sign in, sign out, account switch).
 */
export function useRefreshRecipesOnSessionChange() {
  const queryClient = useQueryClient();
  const { user, isPending } = useAuth();
  const userId = user?.id ?? null;
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (isPending) return;

    if (previousUserId.current !== undefined && previousUserId.current !== userId) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.recipes.all });
      queryClient.removeQueries({ queryKey: queryKeys.favorites.all });
    }

    previousUserId.current = userId;
  }, [isPending, userId, queryClient]);
}
