import type { Ingredient } from '@repo/shared';

import { apiClient } from '@/api/client';

export const ingredientsApi = {
  getAll: async (): Promise<Ingredient[]> => {
    const response = await apiClient.get<Ingredient[]>('/ingredients');
    return response.data;
  },
};
