import {
  CreateRecipeSchema,
  PaginationQuerySchema,
  PopularRecipesQuerySchema,
  RecipeFilterQuerySchema,
  RecipeIdParamSchema,
} from '@repo/shared';
import { Router } from 'express';

import { RecipesController } from '@/controllers/recipes.controller';
import prisma from '@/lib/prisma';
import { authenticate, optionalAuthenticate } from '@/middlewares/auth.middleware';
import { uploadSingle } from '@/middlewares/upload.middleware';
import { validateBody, validateParams, validateQuery } from '@/middlewares/validate.middleware';
import { RecipesService } from '@/services/recipes.service';

const service = new RecipesService(prisma);
const controller = new RecipesController(service);

export const recipesRouter: Router = Router();

recipesRouter.use(optionalAuthenticate);

recipesRouter.get('/', validateQuery(RecipeFilterQuerySchema), controller.list);
recipesRouter.get('/popular', validateQuery(PopularRecipesQuerySchema), controller.listPopular);
recipesRouter.get('/own', authenticate, validateQuery(PaginationQuerySchema), controller.listOwn);
recipesRouter.get('/:id', validateParams(RecipeIdParamSchema), controller.getById);
recipesRouter.post(
  '/',
  authenticate,
  uploadSingle('thumb'),
  validateBody(CreateRecipeSchema),
  controller.create,
);
recipesRouter.delete('/:id', authenticate, validateParams(RecipeIdParamSchema), controller.remove);
