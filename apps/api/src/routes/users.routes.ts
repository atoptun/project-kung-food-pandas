import { PaginationQuerySchema, UserIdParamSchema } from '@repo/shared';
import { Router } from 'express';

import { usersController } from '@/controllers/users.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { uploadSingle } from '@/middlewares/upload.middleware';
import { validateParams, validateQuery } from '@/middlewares/validate.middleware';

export const usersRouter: Router = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', usersController.getCurrentProfile);
usersRouter.patch('/me/avatar', uploadSingle('avatar'), usersController.updateAvatar);
usersRouter.get('/:id', validateParams(UserIdParamSchema), usersController.getPublicProfile);
usersRouter.get(
  '/me/following',
  validateQuery(PaginationQuerySchema),
  usersController.getFollowing,
);
usersRouter.get(
  '/:id/followers',
  validateParams(UserIdParamSchema),
  validateQuery(PaginationQuerySchema),
  usersController.getFollowers,
);
usersRouter.post('/me/following/:id', validateParams(UserIdParamSchema), usersController.follow);
usersRouter.delete(
  '/me/following/:id',
  validateParams(UserIdParamSchema),
  usersController.unfollow,
);
usersRouter.get(
  '/:id/recipes',
  validateParams(UserIdParamSchema),
  validateQuery(PaginationQuerySchema),
  usersController.getUserRecipes,
);
