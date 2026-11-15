import { apiClient } from '../client';
import type { TestimonialsListResponse } from './testimonials.types';

export const testimonialsApi = {
  getAll: async (): Promise<TestimonialsListResponse> => {
    const response = await apiClient.get<TestimonialsListResponse>('/testimonials');
    return response.data;
  },
};
