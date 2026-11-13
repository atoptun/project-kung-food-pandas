import { z } from '../zod';
import { AuthUserSchema, PublicUserSchema } from './auth.schema';
import { PaginationMetaSchema } from './pagination.schema';
import { RecipeShortCardSchema, RecipeTinyCardSchema } from './recipes.schema';

export const UserIdParamSchema = z
  .object({
    id: z.string().max(36).openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d1' }),
  })
  .openapi('UserIdParam');

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
    user: PublicUserSchema,
    recipesCount: z.number().int().nonnegative().openapi({ example: 2 }),
    topRecipes: z
      .array(RecipeTinyCardSchema)
      .openapi({ description: 'Up to 4 latest/top recipes' }),
  })
  .openapi('UserFollowerItem');

export const UserFollowersListResponseSchema = PaginationMetaSchema.extend({
  items: z.array(UserFollowerItemSchema),
}).openapi('UserFollowersListResponse');

export const UserRecipesListResponseSchema = PaginationMetaSchema.extend({
  items: z.array(RecipeShortCardSchema),
}).openapi('UserRecipesListResponse');

export const FollowActionResponseSchema = z
  .object({
    message: z.string().openapi({ example: 'Successfully followed the user.' }),
  })
  .openapi('FollowActionResponse');

export const AvatarUploadSchema = z
  .object({
    avatar: z.any().openapi({
      type: 'string',
      format: 'binary',
      description: 'Avatar image file (jpg, png, webp; max 5MB)',
    }),
  })
  .openapi('AvatarUpload');

export type UserIdParam = z.infer<typeof UserIdParamSchema>;
export type CurrentUserProfileResponse = z.infer<typeof CurrentUserProfileResponseSchema>;
export type UserPublicProfileResponse = z.infer<typeof UserPublicProfileResponseSchema>;
export type UserFollowersListResponse = z.infer<typeof UserFollowersListResponseSchema>;
export type UserRecipesListResponse = z.infer<typeof UserRecipesListResponseSchema>;
export type FollowActionResponse = z.infer<typeof FollowActionResponseSchema>;
export type AvatarUpload = z.infer<typeof AvatarUploadSchema>;
