import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';

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

type TestRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  ui?: ReactElement;
  initialEntries?: string[];
  queryClient?: QueryClient;
};

export function renderWithProviders({
  ui,
  initialEntries = ['/'],
  queryClient = createTestQueryClient(),
  ...options
}: TestRenderOptions = {}): RenderResult & { queryClient: QueryClient } {
  const testRouter = createMemoryRouter(ui ? [{ path: '*', element: ui }] : routes, {
    initialEntries,
  });

  function TestProviders({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return {
    queryClient,
    ...render(<RouterProvider router={testRouter} />, { wrapper: TestProviders, ...options }),
  };
}
