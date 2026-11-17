import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, expect, it, vi } from 'vitest';

import { queryKeys } from '@/api/keys';
import { usersApi } from '@/api/users/users.api';
import { useAvatarUpload } from '@/api/users/users.queries';
import { authClient, type AuthSession, clearClientSession } from '@/lib/auth-client';

import { createTestQueryClient } from '../test-utils';

afterEach(() => vi.restoreAllMocks());

function sessionFor(id: string): AuthSession {
  const now = new Date();
  return {
    user: {
      id,
      name: id,
      email: `${id}@example.test`,
      emailVerified: false,
      image: `${id}.png`,
      createdAt: now,
      updatedAt: now,
    },
    session: {
      id: `session-${id}`,
      userId: id,
      token: `local-${id}`,
      expiresAt: new Date(Date.now() + 60000),
      createdAt: now,
      updatedAt: now,
    },
  };
}

it('does not apply a delayed avatar response after logout and a different account signs in', async () => {
  const client = createTestQueryClient();
  client.setMutationDefaults([], { gcTime: Infinity });
  const session = authClient.$store.atoms.session!;
  session.set({ ...session.get(), data: sessionFor('user-a'), isPending: false });
  let release!: () => void;
  const responseReady = new Promise<void>((resolve) => {
    release = resolve;
  });
  const request = vi.spyOn(usersApi, 'uploadAvatar').mockImplementation(async () => {
    await responseReady;
    return {
      user: { id: 'user-a', name: 'A', email: 'a@example.test', avatar: 'new-a.png' },
      recipesCount: 0,
      favoritesCount: 0,
      followersCount: 0,
      followingCount: 0,
    };
  });
  const { result } = renderHook(() => useAvatarUpload('user-a'), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
  let upload!: Promise<unknown>;
  act(() => {
    upload = result.current.mutateAsync(new File(['avatar'], 'avatar.png', { type: 'image/png' }));
  });
  await waitFor(() => expect(request).toHaveBeenCalledOnce());
  act(() => {
    clearClientSession();
    client.clear();
    session.set({ ...session.get(), data: sessionFor('user-b'), isPending: false });
    release();
  });
  await act(async () => {
    await upload;
  });
  expect(session.get().data?.user.image).toBe('user-b.png');
  expect(client.getQueryData(queryKeys.users.profile('user-a', 'user-a'))).toBeUndefined();
  expect(client.getQueryData(queryKeys.users.profile('user-b', 'user-b'))).toBeUndefined();
});
