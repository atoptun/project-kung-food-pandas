import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UserIdParamsSchema = z.object({
  id: z.string().min(1).openapi({ example: 'cm123user456' }),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().int().min(1).max(100).default(10).openapi({ example: 10 }),
});

export const FollowRecipeSchema = z
  .object({
    id: z.string().openapi({ example: 'recipe-123' }),
    title: z.string().openapi({ example: 'Kung Pao Chicken' }),
    thumb: z.string().nullable(),
    preview: z.string().nullable(),
    time: z.number().int().nullable(),
  })
  .openapi('FollowRecipe');

export const FollowUserSchema = z
  .object({
    id: z.string().openapi({ example: 'cm123user456' }),
    name: z.string().openapi({ example: 'Panda' }),
    avatar: z.string().nullable(),
    recipes: z.array(FollowRecipeSchema),
  })
  .openapi('FollowUser');

export const FollowListResponseSchema = z
  .object({
    users: z.array(FollowUserSchema),
    pagination: z
      .object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        totalCount: z.number().int().nonnegative(),
        totalPages: z.number().int().nonnegative(),
      })
      .openapi('Pagination'),
  })
  .openapi('FollowListResponse');

export const FollowActionResponseSchema = z
  .object({
    message: z.string().openapi({ example: 'Successfully followed user' }),
  })
  .openapi('FollowActionResponse');

export type UserIdParams = z.infer<typeof UserIdParamsSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type FollowListResponse = z.infer<typeof FollowListResponseSchema>;
export type FollowActionResponse = z.infer<typeof FollowActionResponseSchema>;