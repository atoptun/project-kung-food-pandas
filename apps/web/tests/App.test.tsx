import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/App';
import { api } from '@/redux/api';
import { type AppStore, setupStore } from '@/redux/app';

import { renderWithProviders } from './test-utils';

describe('App', () => {
  let store: AppStore;

  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    cleanup();
    store.dispatch(api.util.resetApiState());
    vi.unstubAllGlobals();
  });

  it('opens the home page at /', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        items: [
          {
            id: 'testimonial-1',
            testimonial: 'A test review of Foodies.',
            owner: { id: 'user-1', name: 'Test User', avatar: null },
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    renderWithProviders(<App />, { store });

    await waitFor(() => {
      expect(document.title).toBe('Home | Foodies');
    });
    expect(await screen.findByText('A test review of Foodies.')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('renders the recipe page at /recipe/:id', async () => {
    renderWithProviders(<App />, { store, initialEntries: ['/recipe/1'] });

    await waitFor(() => {
      expect(document.title).toBe('Recipe | Foodies');
    });
  });

  it('renders the recipe add page at /recipe/add', async () => {
    renderWithProviders(<App />, { store, initialEntries: ['/recipe/add'] });

    await waitFor(() => {
      expect(document.title).toBe('Recipe Add | Foodies');
    });
  });

  it('opens the user profile at /user/:id', async () => {
    renderWithProviders(<App />, { store, initialEntries: ['/user/1'] });

    await waitFor(() => {
      expect(document.title).toBe('User Profile | Foodies');
    });
  });

  it('renders the not found page at /*', async () => {
    renderWithProviders(<App />, { store, initialEntries: ['/not-exist-page'] });

    await waitFor(() => {
      expect(document.title).toBe('Not Found | Foodies');
    });
  });
});
