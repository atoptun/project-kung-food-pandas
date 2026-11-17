import { PaginationQuerySchema, UserIdParamsSchema } from '@repo/shared';
import { UserIdParamSchema } from '@repo/shared';
import { Router } from 'express';

import { UsersController } from '@/controllers/users.controller';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { authenticate } from '@/middlewares/auth.middleware';
import { uploadSingle } from '@/middlewares/upload.middleware';
import { validateQuery } from '@/middlewares/validate.middleware';
import { validateParams } from '@/middlewares/validate.middleware';
import { authorRecipesRouter } from '@/routes/recipes.routes';
import { UsersService } from '@/services/users.service';

const service = new UsersService(prisma, cloudinary);
const controller = new UsersController(service);

export const usersRouter: Router = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', controller.getCurrentProfile);
usersRouter.patch('/me/avatar', uploadSingle('avatar'), controller.updateAvatar);
usersRouter.use('/:id/recipes', authorRecipesRouter);
usersRouter.get('/:id', validateParams(UserIdParamSchema), controller.getPublicProfile);

usersRouter.get('/me/following', validateQuery(PaginationQuerySchema), controller.getFollowing);
usersRouter.get(
  '/:id/followers',
  validateParams(UserIdParamsSchema),
  validateQuery(PaginationQuerySchema),
  controller.getFollowers,
);
usersRouter.post('/me/following/:id', validateParams(UserIdParamsSchema), controller.follow);
usersRouter.delete('/me/following/:id', validateParams(UserIdParamsSchema), controller.unfollow);
