import type { Area } from '@repo/shared';

import { apiClient } from '@/api/client';

export const areasApi = {
  getAll: async (): Promise<Area[]> => {
    const response = await apiClient.get<Area[]>('/areas');
    return response.data;
  },
};
