import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../keys';
import { testimonialsApi } from './testimonials.api';

export const useTestimonialsQuery = () => {
  return useQuery({
    queryKey: queryKeys.testimonials.all,
    queryFn: () => testimonialsApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
