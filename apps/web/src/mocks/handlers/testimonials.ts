import { http, HttpResponse } from 'msw';

import type { Testimonial, TestimonialsListResponse } from '@/api/testimonials/testimonials.types';

import testimonialsData from '../data/testimonials.json';

const mockTestimonials: Testimonial[] = testimonialsData;

export const testimonialsHandlers = [
  // GET /testimonials
  http.get('*/testimonials', () => {
    return HttpResponse.json<TestimonialsListResponse>({
      items: mockTestimonials,
      total: mockTestimonials.length,
      page: 1,
      totalPages: 1,
      limit: 10,
    });
  }),
];
