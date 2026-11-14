import { PaginationQuerySchema, UserIdParamsSchema } from '@repo/shared';
import { Router } from 'express';

import { usersController } from '@/controllers/users.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateParams, validateQuery } from '@/middlewares/validate.middleware';

export const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.get('/me/following', validateQuery(PaginationQuerySchema), usersController.getFollowing);
usersRouter.get(
  '/:id/followers',
  validateParams(UserIdParamsSchema),
  validateQuery(PaginationQuerySchema),
  usersController.getFollowers,
);
usersRouter.post(
  '/me/following/:id',
  validateParams(UserIdParamsSchema),
  usersController.follow,
);
usersRouter.delete(
  '/me/following/:id',
  validateParams(UserIdParamsSchema),
  usersController.unfollow,
);