import { PaginationQuerySchema } from '@repo/shared';
import { Router } from 'express';

import { TestimonialsController } from '@/controllers/testimonials.controller';
import prisma from '@/lib/prisma';
import { validateQuery } from '@/middlewares/validate.middleware';
import { TestimonialsService } from '@/services/testimonials.service';

const service = new TestimonialsService(prisma);
const controller = new TestimonialsController(service);

export const testimonialsRouter: Router = Router();

testimonialsRouter.get('/', validateQuery(PaginationQuerySchema), controller.listPaginated);
