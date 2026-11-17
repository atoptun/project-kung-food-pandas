import {
  AvatarUploadSchema,
  CurrentUserProfileResponseSchema,
  UserIdParamSchema,
  UserPublicProfileResponseSchema,
  UserRecipesListResponseSchema,
} from '@repo/shared';
const TAG = ['Users'];
import {
  FollowActionResponseSchema,
  FollowListResponseSchema,
  PaginationQuerySchema,
  UserIdParamsSchema,
} from '@repo/shared';

import { errorResponse, jsonResponse } from './helper';
import { registry } from './registry';

registry.register('FollowActionResponse', FollowActionResponseSchema);
registry.register('FollowListResponse', FollowListResponseSchema);

const totalCountHeader = {
  'X-Total-Count': {
    description: 'Total number of matching users, before pagination.',
    schema: { type: 'integer' as const },
  },
};

registry.registerPath({
  method: 'get',
  path: '/users/me/following',
  operationId: 'listFollowing',
  tags: ['Users'],
  summary: 'List users followed by the current user',
  security: [{ bearerAuth: [] }],
  request: { query: PaginationQuerySchema },
  responses: {
    200: { ...jsonResponse('Following list', FollowListResponseSchema), headers: totalCountHeader },
    400: errorResponse('Invalid pagination parameters'),
    401: errorResponse('Not authorized'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}/followers',
  operationId: 'listFollowers',
  tags: ['Users'],
  summary: 'List followers of a user',
  description: 'This endpoint requires authentication; follower lists are private.',
  security: [{ bearerAuth: [] }],
  request: { params: UserIdParamsSchema, query: PaginationQuerySchema },
  responses: {
    200: { ...jsonResponse('Followers list', FollowListResponseSchema), headers: totalCountHeader },
    400: errorResponse('Invalid parameters or pagination'),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/users/me/following/{id}',
  operationId: 'followUser',
  tags: ['Users'],
  summary: 'Follow a user',
  security: [{ bearerAuth: [] }],
  request: { params: UserIdParamsSchema },
  responses: {
    201: jsonResponse('Follow created', FollowActionResponseSchema),
    400: errorResponse('Cannot follow yourself'),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
    409: errorResponse('Already following this user'),
  },
});

registry.registerPath({
  method: 'delete',
  path: '/users/me/following/{id}',
  operationId: 'unfollowUser',
  tags: ['Users'],
  summary: 'Unfollow a user',
  security: [{ bearerAuth: [] }],
  request: { params: UserIdParamsSchema },
  responses: {
    204: jsonResponse('Follow removed'),
    401: errorResponse('Not authorized'),
    404: errorResponse('User or follow relationship not found'),
  },
});

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
    400: errorResponse('Invalid parameters or query'),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
  },
});
