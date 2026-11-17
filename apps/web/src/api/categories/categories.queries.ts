import { queryOptions, useQuery } from '@tanstack/react-query';

import { categoriesApi } from '@/api/categories/categories.api';
import { queryKeys } from '@/api/keys';

export const categoriesQueryOptions = queryOptions({
  queryKey: queryKeys.categories.all,
  queryFn: () => categoriesApi.getAll(),
  staleTime: Infinity,
  gcTime: Infinity,
});

export const useCategoriesQuery = () => useQuery(categoriesQueryOptions);
