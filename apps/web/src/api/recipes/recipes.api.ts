import type { CreateRecipeInput } from '@repo/shared';

import { apiClient } from '../client';
import type {
  RecipeCard,
  RecipeDetails,
  RecipeFilterQuery,
  RecipesListResponse,
} from './recipes.types';

export const recipesApi = {
  getAll: async (params?: RecipeFilterQuery): Promise<RecipesListResponse> => {
    const response = await apiClient.get<RecipesListResponse>('/recipes', { params });
    return response.data;
  },

  create: async (input: CreateRecipeInput & { photo: File }): Promise<RecipeDetails> => {
    const { photo, ingredients, ...recipe } = input;
    const body = new FormData();
    for (const [key, value] of Object.entries(recipe)) {
      if (value !== undefined) body.append(key, String(value));
    }
    body.append('ingredients', JSON.stringify(ingredients));
    body.append('thumb', photo);

    const response = await apiClient.post<RecipeDetails>('/recipes', body, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },

  getById: async (id: string): Promise<RecipeDetails> => {
    const response = await apiClient.get<RecipeDetails>(`/recipes/${encodeURIComponent(id)}`);
    return response.data;
  },

  getPopular: async (limit: number): Promise<RecipeCard[]> => {
    const response = await apiClient.get<RecipeCard[]>('/recipes/popular', { params: { limit } });
    return response.data;
  },
};
