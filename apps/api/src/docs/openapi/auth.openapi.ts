import { AuthResponseSchema, AuthUserSchema, LoginSchema, RegisterSchema } from '@repo/shared';

import { errorResponse, jsonBody, jsonResponse } from './helper';
import { registry } from './registry';

registry.register('RegisterRequest', RegisterSchema);
registry.register('LoginRequest', LoginSchema);
registry.register('AuthUser', AuthUserSchema);
registry.register('AuthResponse', AuthResponseSchema);

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user',
  description: 'Creates a new user account and returns a session token with basic user profile.',
  request: {
    body: jsonBody(RegisterSchema),
  },
  responses: {
    201: jsonResponse('User registered successfully', AuthResponseSchema),
    409: errorResponse('User with this email already exists'),
    422: errorResponse('Validation failed'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Login user',
  description: 'Authenticates a user by email and password and returns a session token.',
  request: {
    body: jsonBody(LoginSchema),
  },
  responses: {
    200: jsonResponse('Login successful', AuthResponseSchema),
    401: errorResponse('Invalid credentials'),
    422: errorResponse('Validation failed'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Logout user',
  description: 'Invalidates the current user session token.',
  security: [{ bearerAuth: [] }],
  responses: {
    204: jsonResponse('Logged out successfully'),
    401: errorResponse('Not authorized'),
  },
});
