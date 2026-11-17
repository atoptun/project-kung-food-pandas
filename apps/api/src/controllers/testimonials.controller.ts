import type { PaginationQuery, TestimonialsListResponse } from '@repo/shared';
import type { Request, Response } from 'express';

import type { TestimonialsService } from '@/services/testimonials.service';

export class TestimonialsController {
  constructor(private service: TestimonialsService) {}

  listPaginated = async (
    _req: Request,
    res: Response<TestimonialsListResponse, { query: PaginationQuery }>,
  ) => {
    const page = res.locals.query.page || 1;
    const limit = res.locals.query.limit || 10;

    const result = await this.service.listPaginated(page, limit);
    res.status(200).json(result);
  };
}
