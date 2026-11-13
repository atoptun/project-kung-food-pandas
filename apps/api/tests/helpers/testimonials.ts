import prisma from '@/lib/prisma';

import { createAuthUser } from './auth';

export const createTestimonials = async (count: number) => {
  const user = await createAuthUser();

  const testimonials = [];
  for (let i = 0; i < count; i++) {
    testimonials.push({
      testimonial: `Testimonial ${i + 1}`,
      ownerId: user.user.id,
    });
  }

  return await prisma.testimonial.createManyAndReturn({
    data: testimonials,
  });
};
