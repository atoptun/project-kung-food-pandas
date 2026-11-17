import { queryOptions, useQuery } from '@tanstack/react-query';

import { areasApi } from '@/api/areas/areas.api';
import { queryKeys } from '@/api/keys';

export const areasQueryOptions = queryOptions({
  queryKey: queryKeys.areas.all,
  queryFn: () => areasApi.getAll(),
  staleTime: Infinity,
  gcTime: Infinity,
});

export const useAreasQuery = () => useQuery(areasQueryOptions);
