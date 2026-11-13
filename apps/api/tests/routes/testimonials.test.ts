import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '@/app';

import { createTestimonials } from '../helpers/testimonials';

describe('Testimonials Endpoints', () => {
  it('GET /testimonials returns 200 OK with paginated testimonials', async () => {
    const testimonials = await createTestimonials(3);

    const response = await request(app).get('/testimonials').query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        page: expect.any(Number),
        limit: expect.any(Number),
        totalPages: expect.any(Number),
        items: expect.arrayContaining(
          testimonials.map((testimonial) =>
            expect.objectContaining({
              id: testimonial.id,
              testimonial: testimonial.testimonial,
              owner: expect.objectContaining({
                id: testimonial.ownerId,
                name: expect.any(String),
                avatar: expect.toBeOneOf([null, expect.any(String)]),
              }),
            }),
          ),
        ),
      }),
    );
  });
});
