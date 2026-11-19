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

const totalCountHeader = {
  'X-Total-Count': {
    description: 'Total number of matching users, before pagination.',
    schema: { type: 'integer' as const },
  },
};

registry.registerPath({
  method: 'get',
  path: '/users/me',
  operationId: 'getCurrentUserProfile',
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
  operationId: 'updateCurrentUserAvatar',
  tags: TAG,
  summary: 'Update current user avatar',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': { schema: AvatarUploadSchema },
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
  operationId: 'listFollowing',
  tags: TAG,
  summary: 'List users followed by the current user',
  security: [{ bearerAuth: [] }],
  request: { query: PaginationQuerySchema },
  responses: {
    200: {
      ...jsonResponse('Following list', UserFollowersListResponseSchema),
      headers: totalCountHeader,
    },
    400: errorResponse('Invalid pagination parameters'),
    401: errorResponse('Not authorized'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}/followers',
  operationId: 'listFollowers',
  tags: TAG,
  summary: 'List followers of a user',
  description: 'This endpoint requires authentication; follower lists are private.',
  security: [{ bearerAuth: [] }],
  request: { params: UserIdParamSchema, query: PaginationQuerySchema },
  responses: {
    200: {
      ...jsonResponse('Followers list', UserFollowersListResponseSchema),
      headers: totalCountHeader,
    },
    400: errorResponse('Invalid parameters or pagination'),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/users/me/following/{id}',
  operationId: 'followUser',
  tags: TAG,
  summary: 'Follow a user',
  security: [{ bearerAuth: [] }],
  request: { params: UserIdParamSchema },
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
  tags: TAG,
  summary: 'Unfollow a user',
  security: [{ bearerAuth: [] }],
  request: { params: UserIdParamSchema },
  responses: {
    204: jsonResponse('Follow removed'),
    401: errorResponse('Not authorized'),
    404: errorResponse('User or follow relationship not found'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  operationId: 'getPublicUserProfile',
  tags: TAG,
  summary: 'Get public profile of another user',
  security: [{ bearerAuth: [] }],
  request: { params: UserIdParamSchema },
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
  operationId: 'listUserRecipes',
  tags: TAG,
  summary: 'Get recipes created by a user',
  security: [{ bearerAuth: [] }],
  request: { params: UserIdParamSchema, query: PaginationQuerySchema },
  responses: {
    200: jsonResponse('User recipes retrieved successfully', UserRecipesListResponseSchema),
    401: errorResponse('Not authorized'),
    404: errorResponse('User not found'),
  },
});
