import { apiClient } from '../client';
import type { Area, Category, Ingredient } from './dictionaries.types';

export const dictionariesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getAreas: async (): Promise<Area[]> => {
    const response = await apiClient.get<Area[]>('/areas');
    return response.data;
  },

  getIngredients: async (): Promise<Ingredient[]> => {
    const response = await apiClient.get<Ingredient[]>('/ingredients');
    return response.data;
  },
};
