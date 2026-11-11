import { z } from '../zod';

export const PaginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    limit: z.coerce.number().int().min(1).max(100).default(10).openapi({ example: 10 }),
  })
  .openapi('PaginationQuery');

export const PaginationMetaSchema = z
  .object({
    total: z.number().int().nonnegative().openapi({ example: 100 }),
    page: z.number().int().positive().openapi({ example: 1 }),
    totalPages: z.number().int().nonnegative().openapi({ example: 10 }),
    limit: z.number().int().positive().openapi({ example: 10 }),
  })
  .openapi('PaginationMeta');

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
