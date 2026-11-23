import { cleanup, fireEvent, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Categories from '@/components/categories/categories';
import { notify } from '@/lib/notify';

import { server } from './mocks/server';
import { createTestQueryClient, renderWithProviders } from './test-utils';

describe('Categories', () => {
  let queryClient = createTestQueryClient();
  const onSelectCategoryMock = vi.fn();

  beforeEach(() => {
    queryClient = createTestQueryClient();
    onSelectCategoryMock.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  it('renders title, subtitle and loaded categories with All Categories card', async () => {
    renderWithProviders({
      ui: <Categories onSelectCategory={onSelectCategoryMock} />,
      queryClient,
    });

    expect(screen.getByRole('heading', { level: 2, name: /categories/i })).toBeInTheDocument();
    expect(screen.getByText(/discover a variety of delicious recipes/i)).toBeInTheDocument();

    // "All categories" card must be present
    expect(await screen.findByRole('button', { name: /all categories/i })).toBeInTheDocument();

    // Check categories from mocks (e.g., Beef, Breakfast, Dessert)
    expect(
      await screen.findByRole('button', { name: /view recipes in beef/i }),
    ).toBeInTheDocument();
  });

  it('calls onSelectCategory with null when All categories is clicked', async () => {
    renderWithProviders({
      ui: <Categories onSelectCategory={onSelectCategoryMock} />,
      queryClient,
    });

    const allCategoriesButton = await screen.findByRole('button', {
      name: /all categories/i,
    });
    fireEvent.click(allCategoriesButton);

    expect(onSelectCategoryMock).toHaveBeenCalledWith(null, undefined);
  });

  it('calls onSelectCategory with category id when specific category card is clicked', async () => {
    renderWithProviders({
      ui: <Categories onSelectCategory={onSelectCategoryMock} />,
      queryClient,
    });

    const beefButton = await screen.findByRole('button', {
      name: /view recipes in beef/i,
    });
    fireEvent.click(beefButton);

    expect(onSelectCategoryMock).toHaveBeenCalledWith(expect.any(String), 'beef');
  });

  it('shows error notification when categories request fails', async () => {
    const notifySpy = vi.spyOn(notify, 'error');

    server.use(
      http.get('*/categories', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithProviders({
      ui: <Categories onSelectCategory={onSelectCategoryMock} />,
      queryClient,
    });

    await vi.waitFor(() => {
      expect(notifySpy).toHaveBeenCalledWith(expect.stringContaining('Something went wrong'));
    });
  });
});
