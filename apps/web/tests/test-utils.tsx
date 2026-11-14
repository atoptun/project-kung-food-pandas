import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';

import { type AppStore, setupStore } from '@/redux/app';
import { routes } from '@/routes';

type TestRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  initialEntries?: string[];
  store?: AppStore;
};

export function renderWithProviders(
  _ui?: ReactElement,
  { initialEntries = ['/'], store = setupStore(), ...options }: TestRenderOptions = {},
): RenderResult & { store: AppStore } {
  const testRouter = createMemoryRouter(routes, {
    initialEntries,
  });

  function TestProviders({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(<RouterProvider router={testRouter} />, { wrapper: TestProviders, ...options }),
  };
}
