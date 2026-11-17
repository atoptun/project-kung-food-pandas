import {
  CreateRecipeSchema,
  PaginationQuerySchema,
  PopularRecipesQuerySchema,
  RecipeFilterQuerySchema,
  RecipeIdParamSchema,
  UserIdParamSchema,
} from '@repo/shared';
import { Router } from 'express';

import { RecipesController } from '@/controllers/recipes.controller';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { authenticate } from '@/middlewares/auth.middleware';
import { cleanupUpload, uploadSingle } from '@/middlewares/upload.middleware';
import { validateBody, validateParams, validateQuery } from '@/middlewares/validate.middleware';
import { RecipesService } from '@/services/recipes.service';

const controller = new RecipesController(new RecipesService(prisma, cloudinary));

export const recipesRouter: Router = Router();

recipesRouter.get('/', validateQuery(RecipeFilterQuerySchema), controller.list);
recipesRouter.get('/popular', validateQuery(PopularRecipesQuerySchema), controller.popular);
recipesRouter.get('/own', authenticate, validateQuery(PaginationQuerySchema), controller.own);
recipesRouter.get(
  '/favorites',
  authenticate,
  validateQuery(PaginationQuerySchema),
  controller.favorites,
);
recipesRouter.post(
  '/favorites/:id',
  authenticate,
  validateParams(RecipeIdParamSchema),
  controller.addFavorite,
);
recipesRouter.delete(
  '/favorites/:id',
  authenticate,
  validateParams(RecipeIdParamSchema),
  controller.removeFavorite,
);
recipesRouter.post(
  '/',
  authenticate,
  uploadSingle('thumb'),
  cleanupUpload,
  validateBody(CreateRecipeSchema),
  controller.create,
);
recipesRouter.get('/:id', validateParams(RecipeIdParamSchema), controller.detail);
recipesRouter.delete('/:id', authenticate, validateParams(RecipeIdParamSchema), controller.delete);

// Mounted under the authenticated users router, sharing its authorization policy.
export const authorRecipesRouter: Router = Router({ mergeParams: true });
authorRecipesRouter.get(
  '/',
  validateParams(UserIdParamSchema),
  validateQuery(PaginationQuerySchema),
  controller.byAuthor,
);
