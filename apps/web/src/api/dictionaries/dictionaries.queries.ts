import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../keys';
import { dictionariesApi } from './dictionaries.api';

const DICTIONARY_STALE_TIME = 1000 * 60 * 15; // 15 minutes

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.dictionaries.categories(),
    queryFn: () => dictionariesApi.getCategories(),
    staleTime: DICTIONARY_STALE_TIME,
  });
};

export const useAreasQuery = () => {
  return useQuery({
    queryKey: queryKeys.dictionaries.areas(),
    queryFn: () => dictionariesApi.getAreas(),
    staleTime: DICTIONARY_STALE_TIME,
  });
};

export const useIngredientsQuery = () => {
  return useQuery({
    queryKey: queryKeys.dictionaries.ingredients(),
    queryFn: () => dictionariesApi.getIngredients(),
    staleTime: DICTIONARY_STALE_TIME,
  });
};
