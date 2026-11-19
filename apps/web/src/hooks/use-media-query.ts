import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query using useSyncExternalStore to avoid
 * hydration mismatches and layout shifts on client mount.
 */
export function useMediaQuery(query: string, serverFallback = true): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const media = window.matchMedia(query);
      media.addEventListener('change', onStoreChange);
      return () => media.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return serverFallback;
    return window.matchMedia(query).matches;
  }, [query, serverFallback]);

  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useMediaQuery;
