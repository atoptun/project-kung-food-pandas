import type { Category } from '@repo/shared';

import { apiClient } from '@/api/client';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },
};
