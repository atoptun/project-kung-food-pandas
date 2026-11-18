import { screen, waitFor, within } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { mockAuthAccount } from '@/mocks/handlers/auth';
import { mockRecipesList } from '@/mocks/handlers/recipes';

import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';

describe('Private routes', () => {
  it.each(['/recipe/add', '/user/some-user-id'])(
    'redirects a guest from %s to home and opens Sign in',
    async (path) => {
      const { router } = renderWithProviders({ initialEntries: [path] });

      expect(await screen.findByRole('dialog', { name: 'Sign in' })).toBeInTheDocument();
      expect(router.state.location.pathname).toBe('/');
      // The one-off request is cleared, so Back/refresh does not reopen the dialog.
      expect(router.state.location.state).toBeNull();
    },
  );

  it('waits for the session check instead of redirecting', async () => {
    server.use(
      http.get('*/api/auth/get-session', async () => {
        await delay('infinite');
        return HttpResponse.json(null);
      }),
    );

    const { router } = renderWithProviders({ initialEntries: ['/recipe/add'] });

    expect(await within(screen.getByRole('main')).findByRole('status')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/recipe/add');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a private page for an authenticated user', async () => {
    const { router } = renderWithProviders({
      user: mockAuthAccount,
      initialEntries: ['/recipe/add'],
    });

    expect(await screen.findByRole('heading', { name: 'Recipe Add' })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('Recipe Add | Foodies'));
    expect(router.state.location.pathname).toBe('/recipe/add');
  });

  it('keeps public pages available for a guest', async () => {
    const recipe = mockRecipesList[0]!;
    const { router } = renderWithProviders({ initialEntries: [`/recipe/${recipe.id}`] });

    expect(
      await screen.findByRole('heading', { level: 1, name: recipe.title }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(`/recipe/${recipe.id}`);
  });
});
