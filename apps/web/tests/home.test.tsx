import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import HomePage from '@/pages/home';

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Hero, Categories, and Testimonials initially', async () => {
    renderHomePage();

    // 1. Hero
    expect(
      await screen.findByRole('heading', { level: 1, name: /improve your culinary skills/i }),
    ).toBeInTheDocument();

    // 2. Categories
    expect(screen.getByRole('heading', { level: 2, name: /categories/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /all categories/i })).toBeInTheDocument();

    // 3. Testimonials
    expect(
      await screen.findByRole('heading', { level: 2, name: /testimonials/i }),
    ).toBeInTheDocument();
  });

  it('switches to RecipesCatalog when a category is selected, and returns back to Categories on back button click', async () => {
    renderHomePage();

    // Select category (Beef)
    const beefButton = await screen.findByRole('button', { name: /view recipes in beef/i });
    fireEvent.click(beefButton);

    // RecipesCatalog should now be displayed
    expect(await screen.findByRole('heading', { level: 2, name: 'Beef' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to categories/i })).toBeInTheDocument();

    // Categories heading should no longer be visible
    expect(screen.queryByRole('heading', { level: 2, name: 'Categories' })).not.toBeInTheDocument();

    // Click Back to return to Categories
    const backButton = screen.getByRole('button', { name: /back to categories/i });
    fireEvent.click(backButton);

    // Categories should be visible again
    expect(
      await screen.findByRole('heading', { level: 2, name: /categories/i }),
    ).toBeInTheDocument();
  });

  it('switches to RecipesCatalog with "All categories" title when All categories card is selected', async () => {
    renderHomePage();

    const allCategoriesButton = await screen.findByRole('button', { name: /all categories/i });
    fireEvent.click(allCategoriesButton);

    // Should display RecipesCatalog with title "All categories"
    expect(await screen.findByRole('region', { name: /recipes catalog/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /all categories/i })).toBeInTheDocument();
  });
});
