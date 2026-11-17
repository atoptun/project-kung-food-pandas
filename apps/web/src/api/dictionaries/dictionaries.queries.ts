import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../keys';
import { CACHE_TIMES } from '../query-client';
import { dictionariesApi } from './dictionaries.api';

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.dictionaries.categories(),
    queryFn: () => dictionariesApi.getCategories(),
    staleTime: CACHE_TIMES.STATIC_DATA_STALE,
    gcTime: CACHE_TIMES.STATIC_DATA_GC,
  });
};

export const useAreasQuery = () => {
  return useQuery({
    queryKey: queryKeys.dictionaries.areas(),
    queryFn: () => dictionariesApi.getAreas(),
    staleTime: CACHE_TIMES.STATIC_DATA_STALE,
    gcTime: CACHE_TIMES.STATIC_DATA_GC,
  });
};

export const useIngredientsQuery = () => {
  return useQuery({
    queryKey: queryKeys.dictionaries.ingredients(),
    queryFn: () => dictionariesApi.getIngredients(),
    staleTime: CACHE_TIMES.STATIC_DATA_STALE,
    gcTime: CACHE_TIMES.STATIC_DATA_GC,
  });
};
