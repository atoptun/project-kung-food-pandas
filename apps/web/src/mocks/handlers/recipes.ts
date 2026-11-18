import { delay, http, HttpResponse } from 'msw';

import type {
  RecipeActionResponse,
  RecipeCard,
  RecipeDetails,
  RecipesListResponse,
} from '@/api/recipes/recipes.types';
import { clientEnv } from '@/env';

import recipesData from '../data/recipes.json';

const mockRecipes: RecipeDetails[] = recipesData;

const favoriteIds = new Set<string>();

// Bound to the API origin: a bare `*/recipes/:id` would also catch Vite module requests
// such as `/src/api/recipes/recipes.queries.ts` and break the dev server.
const api = (path: string) => `${clientEnv.VITE_API_URL}${path}`;

/**
 * Adds the viewer-specific fields the API computes per request.
 * The mock keeps a single favorites list; the web app ignores `isFavorite` for guests.
 */
function withViewerState(recipe: RecipeDetails): RecipeDetails {
  const isFavorite = favoriteIds.has(recipe.id);
  return {
    ...recipe,
    isFavorite,
    favoritesCount: (recipe.favoritesCount ?? 0) + (isFavorite ? 1 : 0),
  };
}

function toCard(recipe: RecipeDetails): RecipeCard {
  const {
    instructions: _i,
    ingredients: _ing,
    area: _a,
    category: _c,
    ...card
  } = withViewerState(recipe);
  return card;
}

function notFound(message = 'Recipe not found') {
  return HttpResponse.json({ status: 404, message }, { status: 404 });
}

/** Test/dev helper: clears the mocked favorites list. */
export function resetMockFavorites(ids: string[] = []) {
  favoriteIds.clear();
  ids.forEach((id) => favoriteIds.add(id));
}

export const mockRecipesList = mockRecipes;

export const recipesHandlers = [
  http.post(api('/recipes'), async () => {
    await delay(500);
    return HttpResponse.json(mockRecipes[0], { status: 201 });
  }),

  // Static segments must be registered before `/recipes/:id`.
  http.get(api('/recipes/popular'), ({ request }) => {
    const limit = Number(new URL(request.url).searchParams.get('limit') ?? 4);
    const popular = [...mockRecipes]
      .sort((a, b) => (b.favoritesCount ?? 0) - (a.favoritesCount ?? 0))
      .slice(0, limit)
      .map(toCard);

    return HttpResponse.json<RecipeCard[]>(popular);
  }),

  http.get(api('/recipes/favorites'), ({ request }) => {
    const params = new URL(request.url).searchParams;
    const page = Number(params.get('page') ?? 1);
    const limit = Number(params.get('limit') ?? 10);
    const favorites = mockRecipes.filter((recipe) => favoriteIds.has(recipe.id)).map(toCard);

    return HttpResponse.json<RecipesListResponse>({
      items: favorites.slice((page - 1) * limit, page * limit),
      total: favorites.length,
      page,
      limit,
      totalPages: Math.ceil(favorites.length / limit),
    });
  }),

  http.post(api('/recipes/favorites/:id'), ({ params }) => {
    const id = String(params.id);
    if (!mockRecipes.some((recipe) => recipe.id === id)) return notFound();
    if (favoriteIds.has(id)) {
      return HttpResponse.json(
        { status: 409, message: 'Recipe is already in favorites' },
        { status: 409 },
      );
    }

    favoriteIds.add(id);
    return HttpResponse.json<RecipeActionResponse>({ message: 'Recipe added to favorites' });
  }),

  http.delete(api('/recipes/favorites/:id'), ({ params }) => {
    const id = String(params.id);
    if (!favoriteIds.delete(id)) return notFound('Recipe not found or not in favorites');

    return HttpResponse.json<RecipeActionResponse>({ message: 'Recipe removed from favorites' });
  }),

  http.get(api('/recipes/:id'), ({ params }) => {
    const recipe = mockRecipes.find(({ id }) => id === params.id);
    if (!recipe) return notFound();

    return HttpResponse.json<RecipeDetails>(withViewerState(recipe));
  }),
];
