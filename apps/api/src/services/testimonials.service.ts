import type { TestimonialsListResponse } from '@repo/shared';

import type { PrismaClient } from '@/generated/prisma/client';

export class TestimonialsService {
  constructor(private db: PrismaClient) {}

  listPaginated = async (page: number, limit: number): Promise<TestimonialsListResponse> => {
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.db.testimonial.findMany({
        select: {
          id: true,
          testimonial: true,
          owner: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.db.testimonial.count(),
    ]);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      items,
    };
  };
}
