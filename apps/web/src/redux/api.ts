import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { TestimonialsListResponse } from '@repo/shared';

import { clientEnv } from '@/env';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: clientEnv.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    getTestimonials: builder.query<TestimonialsListResponse, void>({
      query: () => '/testimonials',
      keepUnusedDataFor: 60 * 60 * 24, // 1 day
    }),
  }),
});

export const { useGetTestimonialsQuery } = api;
