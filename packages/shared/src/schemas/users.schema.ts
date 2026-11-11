import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { AuthUserSchema } from './auth.schema';
import { ShortRecipeItemSchema, TinyRecipeItemSchema } from './recipes.schema';

extendZodWithOpenApi(z);

export const UserIdParamSchema = z
  .object({
    id: z.string().max(32).openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d1' }),
  })
  .openapi('UserIdParam');

export const PaginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    limit: z.coerce.number().int().min(1).max(50).default(5).openapi({ example: 5 }),
  })
  .openapi('PaginationQuery');

export const CurrentUserProfileResponseSchema = z
  .object({
    user: AuthUserSchema,
    recipesCount: z.number().int().nonnegative().openapi({ example: 12 }),
    favoritesCount: z.number().int().nonnegative().openapi({ example: 5 }),
    followersCount: z.number().int().nonnegative().openapi({ example: 48 }),
    followingCount: z.number().int().nonnegative().openapi({ example: 15 }),
  })
  .openapi('CurrentUserProfileResponse');

export const UserPublicProfileResponseSchema = z
  .object({
    user: AuthUserSchema,
    recipesCount: z.number().int().nonnegative().openapi({ example: 12 }),
    followersCount: z.number().int().nonnegative().openapi({ example: 48 }),
  })
  .openapi('UserPublicProfileResponse');

export const UserFollowerItemSchema = z
  .object({
    user: AuthUserSchema,
    recipesCount: z.number().int().nonnegative().openapi({ example: 2 }),
    topRecipes: z
      .array(TinyRecipeItemSchema)
      .openapi({ description: 'Up to 4 latest/top recipes' }),
  })
  .openapi('UserFollowerItem');

export const UserFollowersListResponseSchema = z
  .object({
    total: z.number().int().nonnegative().openapi({ example: 1 }),
    page: z.number().int().positive().openapi({ example: 1 }),
    totalPages: z.number().int().nonnegative().openapi({ example: 1 }),
    perPage: z.number().int().positive().openapi({ example: 5 }),
    followers: z.array(UserFollowerItemSchema),
  })
  .openapi('UserFollowersListResponse');

export const UserRecipesListResponseSchema = z
  .object({
    total: z.number().int().nonnegative().openapi({ example: 1 }),
    page: z.number().int().positive().openapi({ example: 1 }),
    totalPages: z.number().int().nonnegative().openapi({ example: 1 }),
    perPage: z.number().int().positive().openapi({ example: 10 }),
    recipes: z.array(ShortRecipeItemSchema),
  })
  .openapi('UserRecipesListResponse');

export const FollowActionResponseSchema = z
  .object({
    message: z.string().openapi({ example: 'Successfully followed the user.' }),
  })
  .openapi('FollowActionResponse');

export type UserIdParam = z.infer<typeof UserIdParamSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type CurrentUserProfileResponse = z.infer<typeof CurrentUserProfileResponseSchema>;
export type UserPublicProfileResponse = z.infer<typeof UserPublicProfileResponseSchema>;
export type UserFollowersListResponse = z.infer<typeof UserFollowersListResponseSchema>;
export type UserRecipesListResponse = z.infer<typeof UserRecipesListResponseSchema>;
export type FollowActionResponse = z.infer<typeof FollowActionResponseSchema>;
