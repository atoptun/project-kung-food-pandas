import {
  CurrentUserProfileResponseSchema,
  FollowActionResponseSchema,
  PaginationQuerySchema,
  UserFollowersListResponseSchema,
  UserIdParamSchema,
  UserPublicProfileResponseSchema,
  UserRecipesListResponseSchema,
  z,
} from '@repo/shared';

import { errorResponse, jsonResponse } from './helper';
import { registry } from './registry';

registry.register('CurrentUserProfileResponse', CurrentUserProfileResponseSchema);
registry.register('UserPublicProfileResponse', UserPublicProfileResponseSchema);
registry.register('UserFollowersListResponse', UserFollowersListResponseSchema);
registry.register('UserRecipesListResponse', UserRecipesListResponseSchema);
registry.register('FollowActionResponse', FollowActionResponseSchema);

const AvatarUploadSchema = z
  .object({
    avatar: z.any().openapi({
      type: 'string',
      format: 'binary',
      description: 'Avatar image file (jpg, png, webp; max 5MB)',
    }),
  })
  .openapi('AvatarUpload');

registry.registerPath({
  method: 'get',
  path: '/users/me',
  tags: ['Users'],
  summary: 'Get current user profile with statistics',
  security: [{ bearerAuth: [] }],
  responses: {
    200: jsonResponse(
      'Current user profile retrieved successfully',
      CurrentUserProfileResponseSchema,
    ),
    401: errorResponse('Not authorized'),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/users/me/avatar',
  tags: ['Users'],
  summary: 'Update current user avatar',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: AvatarUploadSchema,
        },
      },
    },
  },
  responses: {
    200: jsonResponse('Avatar updated successfully', CurrentUserProfileResponseSchema),
    400: errorResponse('Invalid image file or size exceeds limit'),
    401: errorResponse('Not authorized'),
    422: errorResponse('Validation failed'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/me/following',
  tags: ['Users'],
  summary: 'Get users followed by current user (following)',
  security: [{ bearerAuth: [] }],
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: jsonResponse(
      'List of followed users retrieved successfully',
      UserFollowersListResponseSchema,
    ),
    401: errorResponse('Not authorized'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/users/me/following/{id}',
  tags: ['Users'],
  summary: 'Follow a user by ID',
  security: [{ bearerAuth: [] }],
  request: {
    params: UserIdParamSchema,
  },
  responses: {
    200: jsonResponse('Successfully followed the user', FollowActionResponseSchema),
    400: errorResponse('Cannot follow yourself'),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
    409: errorResponse('Already following this user'),
  },
});

registry.registerPath({
  method: 'delete',
  path: '/users/me/following/{id}',
  tags: ['Users'],
  summary: 'Unfollow a user by ID',
  security: [{ bearerAuth: [] }],
  request: {
    params: UserIdParamSchema,
  },
  responses: {
    200: jsonResponse('Successfully unfollowed the user', FollowActionResponseSchema),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found or not currently followed'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['Users'],
  summary: 'Get public profile of another user by ID',
  request: {
    params: UserIdParamSchema,
  },
  responses: {
    200: jsonResponse(
      'User public profile retrieved successfully',
      UserPublicProfileResponseSchema,
    ),
    404: errorResponse('User not found'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}/followers',
  tags: ['Users'],
  summary: 'Get followers of a specific user by ID',
  request: {
    params: UserIdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: jsonResponse(
      'List of user followers retrieved successfully',
      UserFollowersListResponseSchema,
    ),
    404: errorResponse('User not found'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}/recipes',
  tags: ['Users'],
  summary: 'Get recipes created by a specific user by ID',
  request: {
    params: UserIdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: jsonResponse('List of user recipes retrieved successfully', UserRecipesListResponseSchema),
    404: errorResponse('User not found'),
  },
});
