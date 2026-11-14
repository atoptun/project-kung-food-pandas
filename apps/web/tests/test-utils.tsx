import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

import { type AppStore, setupStore } from '@/redux/app';

type TestRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  initialEntries?: string[];
  store?: AppStore;
};

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'], store = setupStore(), ...options }: TestRenderOptions = {},
): RenderResult & { store: AppStore } {
  function TestProviders({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: TestProviders, ...options }) };
}
