import { PaginationQuerySchema, UserIdParamSchema } from '@repo/shared';
import { Router } from 'express';

import { UsersController } from '@/controllers/users.controller';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { authenticate } from '@/middlewares/auth.middleware';
import { uploadSingle } from '@/middlewares/upload.middleware';
import { validateParams, validateQuery } from '@/middlewares/validate.middleware';
import { UsersService } from '@/services/users.service';

const service = new UsersService(prisma, cloudinary);
const controller = new UsersController(service);

export const usersRouter: Router = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', controller.getCurrentProfile);
usersRouter.patch('/me/avatar', uploadSingle('avatar'), controller.updateAvatar);
usersRouter.get('/me/following', validateQuery(PaginationQuerySchema), controller.getFollowing);
usersRouter.post('/me/following/:id', validateParams(UserIdParamSchema), controller.follow);
usersRouter.delete('/me/following/:id', validateParams(UserIdParamSchema), controller.unfollow);
usersRouter.get(
  '/:id/followers',
  validateParams(UserIdParamSchema),
  validateQuery(PaginationQuerySchema),
  controller.getFollowers,
);
usersRouter.get(
  '/:id/recipes',
  validateParams(UserIdParamSchema),
  validateQuery(PaginationQuerySchema),
  controller.getUserRecipes,
);
usersRouter.get('/:id', validateParams(UserIdParamSchema), controller.getPublicProfile);
