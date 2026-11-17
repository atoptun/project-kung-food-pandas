import { apiClient } from '../client';
import type {
  PaginationQuery,
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
