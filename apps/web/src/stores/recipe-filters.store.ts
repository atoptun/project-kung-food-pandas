import { create } from 'zustand';

interface RecipeFiltersState {
  page: number;
  areaId: string;
  ingredientId: string;
  setAreaId: (areaId: string) => void;
  setIngredientId: (ingredientId: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useRecipeFiltersStore = create<RecipeFiltersState>((set) => ({
  page: 1,
  areaId: '',
  ingredientId: '',

  setAreaId: (areaId) => set({ areaId, page: 1 }),
  setIngredientId: (ingredientId) => set({ ingredientId, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ page: 1, areaId: '', ingredientId: '' }),
}));
