import {
  AvatarUploadSchema,
  CurrentUserProfileResponseSchema,
  FollowActionResponseSchema,
  PaginationQuerySchema,
  UserFollowersListResponseSchema,
  UserIdParamSchema,
  UserPublicProfileResponseSchema,
  UserRecipesListResponseSchema,
} from '@repo/shared';

import { errorResponse, jsonResponse } from './helper';
import { registry } from './registry';

const TAG = ['Users'];

registry.register('CurrentUserProfileResponse', CurrentUserProfileResponseSchema);
registry.register('UserPublicProfileResponse', UserPublicProfileResponseSchema);
registry.register('UserFollowersListResponse', UserFollowersListResponseSchema);
registry.register('UserRecipesListResponse', UserRecipesListResponseSchema);
registry.register('FollowActionResponse', FollowActionResponseSchema);
registry.register('AvatarUploadRequest', AvatarUploadSchema);

registry.registerPath({
  method: 'get',
  path: '/users/me',
  tags: TAG,
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
  tags: TAG,
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
  tags: TAG,
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
  tags: TAG,
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
  tags: TAG,
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
  tags: TAG,
  summary: 'Get public profile of another user by ID',
  security: [{ bearerAuth: [] }],
  request: {
    params: UserIdParamSchema,
  },
  responses: {
    200: jsonResponse(
      'User public profile retrieved successfully',
      UserPublicProfileResponseSchema,
    ),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}/followers',
  tags: TAG,
  summary: 'Get followers of a specific user by ID',
  security: [{ bearerAuth: [] }],
  request: {
    params: UserIdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: jsonResponse(
      'List of user followers retrieved successfully',
      UserFollowersListResponseSchema,
    ),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}/recipes',
  tags: TAG,
  summary: 'Get recipes created by a specific user by ID',
  security: [{ bearerAuth: [] }],
  request: {
    params: UserIdParamSchema,
    query: PaginationQuerySchema,
  },
  responses: {
    200: jsonResponse('List of user recipes retrieved successfully', UserRecipesListResponseSchema),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
  },
});
