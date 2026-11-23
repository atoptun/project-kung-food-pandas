import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { createQueryClient } from '@/api/query-client';
import { mockAuthAccount } from '@/mocks/handlers/auth';
import { mockRecipesList, resetMockFavorites } from '@/mocks/handlers/recipes';
import { useAuthModalStore } from '@/stores/auth-modal.store';

import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';

const recipe = mockRecipesList[0]!;
const recipePath = `/recipe/${recipe.id}`;

function getMain() {
  return screen.getByRole('main');
}

async function findRecipeTitle() {
  return within(getMain()).findByRole('heading', { level: 1, name: recipe.title });
}

describe('Recipe page', () => {
  it('renders the recipe details, ingredients and preparation', async () => {
    renderWithProviders({ initialEntries: [recipePath] });

    expect(await findRecipeTitle()).toBeInTheDocument();

    const breadcrumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(breadcrumbs).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(breadcrumbs).getByRole('link', { name: recipe.category!.name })).toHaveAttribute(
      'href',
      `/category/${recipe.category!.slug || recipe.category!.id}`,
    );
    expect(within(breadcrumbs).getByText(recipe.title)).toHaveAttribute('aria-current', 'page');

    expect(screen.getAllByText(recipe.category!.name).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(`${recipe.time} min`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Created by/ })).toHaveAttribute(
      'href',
      `/user/${recipe.owner!.id}`,
    );

    const ingredients = screen.getByRole('region', { name: 'Ingredients' });
    expect(within(ingredients).getAllByRole('listitem')).toHaveLength(recipe.ingredients.length);
    expect(screen.getByRole('region', { name: 'Recipe preparation' })).toBeInTheDocument();
  });

  it('shows up to four popular recipes as cards', async () => {
    renderWithProviders({ initialEntries: [recipePath] });

    const popular = await screen.findByRole('region', { name: 'Popular recipes' });
    const cards = await within(popular).findAllByRole('article');
    expect(cards).toHaveLength(4);
    // The opened recipe is not repeated among the popular cards.
    expect(
      within(popular).queryByRole('link', { name: `View recipe: ${recipe.title}` }),
    ).not.toBeInTheDocument();
  });

  it('handles an unknown recipe id', async () => {
    renderWithProviders({ initialEntries: ['/recipe/unknown-id'] });

    expect(
      await within(getMain()).findByRole('heading', { level: 1, name: 'Recipe not found' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  });

  it('shows a retryable error when the API fails', async () => {
    server.use(http.get('*/recipes/:id', () => HttpResponse.json({}, { status: 500 })));

    renderWithProviders({ initialEntries: [recipePath] });

    const alert = await within(getMain()).findByRole('alert', {}, { timeout: 3000 });
    expect(within(alert).getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('opens Sign in when a guest adds the recipe to favorites', async () => {
    renderWithProviders({ initialEntries: [recipePath], user: null });

    await findRecipeTitle();
    const button = await screen.findByRole('button', { name: 'Add to favorites' });
    await waitFor(() => expect(button).toBeEnabled());

    fireEvent.click(button);

    expect(useAuthModalStore.getState().view).toBe('sign-in');
  });

  it('shows the favorite state returned by the API for a signed-in user', async () => {
    resetMockFavorites([recipe.id]);
    renderWithProviders({ initialEntries: [recipePath], user: mockAuthAccount });

    await findRecipeTitle();
    expect(await screen.findByRole('button', { name: 'Remove from favorites' })).toBeEnabled();
  });

  it('never shows a filled heart to a guest', async () => {
    resetMockFavorites([recipe.id, ...mockRecipesList.map(({ id }) => id)]);
    renderWithProviders({ initialEntries: [recipePath], user: null });

    await findRecipeTitle();
    expect(await screen.findByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();

    const popular = await screen.findByRole('region', { name: 'Popular recipes' });
    await within(popular).findAllByRole('article');
    within(popular)
      .getAllByRole('button', { name: /favorites$/ })
      .forEach((button) => expect(button).toHaveAttribute('aria-pressed', 'false'));
  });

  it('adds and removes the recipe from favorites for a signed-in user', async () => {
    renderWithProviders({ initialEntries: [recipePath], user: mockAuthAccount });

    await findRecipeTitle();
    const addButton = await screen.findByRole('button', { name: 'Add to favorites' });
    await waitFor(() => expect(addButton).toBeEnabled());

    fireEvent.click(addButton);

    const removeButton = await screen.findByRole('button', { name: 'Remove from favorites' });
    await waitFor(() => expect(removeButton).toBeEnabled());

    fireEvent.click(removeButton);

    expect(await screen.findByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
  });

  it('rolls back the favorite state when the request fails', async () => {
    resetMockFavorites();
    server.use(
      http.post('*/recipes/favorites/:id', () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    );

    // The app query client reports failed actions with a global toast.
    renderWithProviders({
      initialEntries: [recipePath],
      user: mockAuthAccount,
      queryClient: createQueryClient(),
    });

    await findRecipeTitle();
    const addButton = await screen.findByRole('button', { name: 'Add to favorites' });
    await waitFor(() => expect(addButton).toBeEnabled());

    fireEvent.click(addButton);

    expect(await screen.findByText('Server error')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeEnabled(),
    );
  });
});
