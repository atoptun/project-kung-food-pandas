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

export const UserIdParamsSchema = z.object({
  id: z.string().min(1).openapi({ example: 'cm123user456' }),
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
    recipes: z.array(FollowRecipeSchema).openapi({
      description:
        'All user recipes, newest known creation date first, including original dates from legacy imports; unknown dates last. Equal or unknown dates use ascending recipe ID for stable ordering. The full array is retained for recipe counts.',
    }),
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

export type UserIdParams = z.infer<typeof UserIdParamsSchema>;
export type FollowListResponse = z.infer<typeof FollowListResponseSchema>;
