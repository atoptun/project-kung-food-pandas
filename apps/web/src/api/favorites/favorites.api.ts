import { isAxiosError } from 'axios';

import { apiClient } from '../client';
import type { PaginationQuery, RecipesListResponse } from '../recipes/recipes.types';

/** Largest page the API accepts (`PaginationQuerySchema.limit` max). */
const IDS_PAGE_LIMIT = 100;

export const favoritesApi = {
  getPage: async (params: PaginationQuery): Promise<RecipesListResponse> => {
    const response = await apiClient.get<RecipesListResponse>('/recipes/favorites', { params });
    return response.data;
  },

  /**
   * Ids of every favorite recipe of the current user.
   * The recipe contracts have no `isFavorite` flag yet, so cards derive their state from this list.
   */
  getAllIds: async (): Promise<string[]> => {
    const first = await favoritesApi.getPage({ page: 1, limit: IDS_PAGE_LIMIT });
    const ids = first.items.map((recipe) => recipe.id);

    for (let page = 2; page <= first.totalPages; page += 1) {
      const data = await favoritesApi.getPage({ page, limit: IDS_PAGE_LIMIT });
      ids.push(...data.items.map((recipe) => recipe.id));
    }

    return ids;
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
