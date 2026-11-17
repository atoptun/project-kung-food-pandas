import { apiClient } from '../client';
import type {
  PaginationQuery,
  RecipeCard,
  RecipeDetails,
  RecipesListResponse,
} from './recipes.types';

export const recipesApi = {
  getOwn: async (params: PaginationQuery): Promise<RecipesListResponse> =>
    (await apiClient.get<RecipesListResponse>('/recipes/own', { params })).data,

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/recipes/${encodeURIComponent(id)}`);
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
