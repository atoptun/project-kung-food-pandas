import { createAuthClient } from 'better-auth/react';

import { clientEnv } from '@/env';

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_API_URL,
  fetchOptions: {
    // Required to send/receive the session cookie across origins (Vercel <-> Render)
    credentials: 'include',
    // Better Auth captures `fetch` when the client is created; resolve it per request instead
    // so request interceptors installed later (MSW in dev and tests) see auth calls.
    customFetchImpl: (input, init) => fetch(input, init),
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

/** Drops the cached session on the client without a network request (e.g. when logout fails). */
export function clearClientSession() {
  const session = authClient.$store.atoms.session;
  if (!session) return;
  session.set({ ...session.get(), data: null, error: null, isPending: false });
}

/** Keep all session consumers (including the Header and mobile menu) in sync after upload. */
export function updateClientAvatar(userId: string, image: string | null) {
  const session = authClient.$store.atoms.session;
  const current = session?.get();
  if (!session || !current?.data || current.data.user.id !== userId) return false;
  session.set({
    ...current,
    data: { ...current.data, user: { ...current.data.user, image } },
  });
  return true;
}

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthSessionUser = AuthSession['user'];
