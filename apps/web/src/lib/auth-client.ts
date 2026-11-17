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

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthSessionUser = AuthSession['user'];
