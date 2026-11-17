import { apiClient } from '../client';
import type {
  RecipeCard,
  RecipeDetails,
  RecipeFilterQuery,
  RecipesListResponse,
} from './recipes.types';

export const recipesApi = {
  getList: async (filters: RecipeFilterQuery): Promise<RecipesListResponse> => {
    const response = await apiClient.get<RecipesListResponse>('/recipes', { params: filters });
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
