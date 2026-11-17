import { cleanup, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mockAuthAccount } from '@/mocks/handlers/auth';

import { server } from './mocks/server';
import { createTestQueryClient, renderWithProviders } from './test-utils';

describe('App', () => {
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  it('opens the home page at / and displays testimonials from MSW', async () => {
    renderWithProviders({ queryClient });

    await waitFor(() => {
      expect(document.title).toBe('Home | Foodies');
    });

    // Wait for lazy loaded HomePage to resolve and render Hero
    expect(
      await screen.findByRole('heading', { level: 1, name: /improve your culinary skills/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/dive into a world of delicious recipes/i)).toBeInTheDocument();
    const addRecipeButtons = screen.getAllByRole('link', { name: /add recipe/i });
    expect(addRecipeButtons.length).toBeGreaterThanOrEqual(1);
    expect(addRecipeButtons.some((btn) => btn.getAttribute('href') === '/recipe/add')).toBe(true);

    expect(await screen.findByText(/Mock testimonial 1/i)).toBeInTheDocument();
  });

  it('displays error message when testimonials fetch fails', async () => {
    server.use(
      http.get('*/testimonials', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithProviders({ queryClient });

    expect(await screen.findByText('Не вдалося завантажити відгуки.')).toBeInTheDocument();
  });

  it('renders the recipe page at /recipe/:id', async () => {
    renderWithProviders({ queryClient, initialEntries: ['/recipe/1'] });

    await waitFor(() => {
      expect(document.title).toBe('Recipe | Foodies');
    });
  });

  it('renders the recipe add page at /recipe/add', async () => {
    renderWithProviders({ queryClient, initialEntries: ['/recipe/add'], user: mockAuthAccount });

    await waitFor(() => {
      expect(document.title).toBe('Recipe Add | Foodies');
    });
  });

  it('opens the user profile at /user/:id', async () => {
    renderWithProviders({ queryClient, initialEntries: ['/user/1'], user: mockAuthAccount });

    await waitFor(() => {
      expect(document.title).toBe('User Profile | Foodies');
    });
  });

  it('renders the not found page at /*', async () => {
    renderWithProviders({ queryClient, initialEntries: ['/not-exist-page'] });

    await waitFor(() => {
      expect(document.title).toBe('Not Found | Foodies');
    });
  });
});
