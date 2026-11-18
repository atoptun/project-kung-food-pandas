import { isAxiosError } from 'axios';

import { apiClient } from '../client';
import type { PaginationQuery, RecipesListResponse } from '../recipes/recipes.types';

export const favoritesApi = {
  /** One page of the current user's favorites (profile "My favorites" tab). */
  getPage: async (params: PaginationQuery): Promise<RecipesListResponse> => {
    const response = await apiClient.get<RecipesListResponse>('/recipes/favorites', { params });
    return response.data;
  },

  add: async (id: string): Promise<void> => {
    try {
      await apiClient.post(`/recipes/favorites/${encodeURIComponent(id)}`);
    } catch (error) {
      // 409: already in favorites — the desired state is reached.
      if (isAxiosError(error) && error.response?.status === 409) return;
      throw error;
    }
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/recipes/favorites/${encodeURIComponent(id)}`);
  },
};
