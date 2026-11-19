import type {
  PaginationQuery,
  RecipeActionResponse,
  RecipeIdParam,
  RecipesListResponse,
} from '@repo/shared';
import type { Request, Response } from 'express';

import { getAuthUserId } from '@/middlewares/auth.middleware';
import type { FavoritesService } from '@/services/favorites.service';

export class FavoritesController {
  constructor(private service: FavoritesService) {}

  list = async (req: Request, res: Response<RecipesListResponse, { query: PaginationQuery }>) => {
    const result = await this.service.list(getAuthUserId(req), res.locals.query);
    res.status(200).json(result);
  };

  add = async (req: Request<RecipeIdParam>, res: Response<RecipeActionResponse>) => {
    const result = await this.service.add(getAuthUserId(req), req.params.id);
    res.status(200).json(result);
  };

  remove = async (req: Request<RecipeIdParam>, res: Response<RecipeActionResponse>) => {
    const result = await this.service.remove(getAuthUserId(req), req.params.id);
    res.status(200).json(result);
  };
}
