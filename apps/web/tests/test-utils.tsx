import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';

import { authClient } from '@/lib/auth-client';
import { type MockAuthUser, setMockSessionUser } from '@/mocks/handlers/auth';
import { routes } from '@/routes';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Better Auth keeps the session in a module-level store.
 * Reset it to "pending" and force the next mount to refetch `/get-session`.
 */
export function resetAuthSession() {
  const session = authClient.$store.atoms.session;
  if (!session) throw new Error('Better Auth session store is not available');
  session.set({ ...session.get(), data: null, error: null, isPending: true, isRefetching: false });
  authClient.$store.notify('$sessionSignal');
}

type TestRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  ui?: ReactElement;
  initialEntries?: string[];
  queryClient?: QueryClient;
  /** Signed-in user returned by the mocked `/api/auth/get-session`; guest by default. */
  user?: MockAuthUser | null;
};

export function renderWithProviders({
  ui,
  initialEntries = ['/'],
  queryClient = createTestQueryClient(),
  user,
  ...options
}: TestRenderOptions = {}): RenderResult & {
  queryClient: QueryClient;
  router: ReturnType<typeof createMemoryRouter>;
} {
  if (user !== undefined) {
    setMockSessionUser(user);
    resetAuthSession();
  }

  const testRouter = createMemoryRouter(ui ? [{ path: '*', element: ui }] : routes, {
    initialEntries,
  });

  function TestProviders({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return {
    queryClient,
    router: testRouter,
    ...render(<RouterProvider router={testRouter} />, { wrapper: TestProviders, ...options }),
  };
}
