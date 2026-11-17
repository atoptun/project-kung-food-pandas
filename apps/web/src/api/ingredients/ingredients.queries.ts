import { queryOptions, useQuery } from '@tanstack/react-query';

import { ingredientsApi } from '@/api/ingredients/ingredients.api';
import { queryKeys } from '@/api/keys';

export const ingredientsQueryOptions = queryOptions({
  queryKey: queryKeys.ingredients.all,
  queryFn: () => ingredientsApi.getAll(),
  staleTime: Infinity,
  gcTime: Infinity,
});

export const useIngredientsQuery = () => useQuery(ingredientsQueryOptions);
