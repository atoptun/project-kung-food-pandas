import { PaginationQuerySchema, RecipeIdParamSchema } from '@repo/shared';
import { Router } from 'express';

import { FavoritesController } from '@/controllers/favorites.controller';
import prisma from '@/lib/prisma';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateParams, validateQuery } from '@/middlewares/validate.middleware';
import { FavoritesService } from '@/services/favorites.service';

const service = new FavoritesService(prisma);
const controller = new FavoritesController(service);

/** Mounted at `/recipes/favorites`. Every endpoint is private. */
export const favoritesRouter: Router = Router();

favoritesRouter.use(authenticate);

favoritesRouter.get('/', validateQuery(PaginationQuerySchema), controller.list);
favoritesRouter.post('/:id', validateParams(RecipeIdParamSchema), controller.add);
favoritesRouter.delete('/:id', validateParams(RecipeIdParamSchema), controller.remove);
