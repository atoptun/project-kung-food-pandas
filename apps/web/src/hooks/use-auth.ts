import { useSession } from '@/lib/auth-client';

/**
 * Current auth state for any page/component.
 * `isPending` is true until the first session check finishes — do not treat the user as a guest yet.
 */
export function useAuth() {
  const { data, isPending } = useSession();
  const user = data?.user ?? null;

  return {
    user,
    isAuthenticated: user !== null,
    isPending,
  };
}
