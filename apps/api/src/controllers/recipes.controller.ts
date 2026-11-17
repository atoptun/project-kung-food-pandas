import type {
  CreateRecipeInput,
  PaginationQuery,
  PopularRecipesQuery,
  RecipeActionResponse,
  RecipeCard,
  RecipeDetails,
  RecipeFilterQuery,
  RecipeIdParam,
  RecipesListResponse,
  UserIdParam,
  UserRecipesListResponse,
} from '@repo/shared';
import type { Request, Response } from 'express';

import { UnauthorizedError, UnprocessableEntityError } from '@/errors/http.error';
import type { RecipesService } from '@/services/recipes.service';

function getAuthUserId(req: Request): string {
  if (!req.user) throw new UnauthorizedError('Not authorized');
  return req.user.id;
}

export class RecipesController {
  constructor(private service: RecipesService) {}

  list = async (
    _req: Request,
    res: Response<RecipesListResponse, { query: RecipeFilterQuery }>,
  ) => {
    res.status(200).json(await this.service.list(res.locals.query));
  };

  popular = async (_req: Request, res: Response<RecipeCard[], { query: PopularRecipesQuery }>) => {
    res.status(200).json(await this.service.popular(res.locals.query.limit));
  };

  own = async (req: Request, res: Response<RecipesListResponse, { query: PaginationQuery }>) => {
    res.status(200).json(await this.service.own(getAuthUserId(req), res.locals.query));
  };

  byAuthor = async (
    req: Request<UserIdParam>,
    res: Response<UserRecipesListResponse, { query: PaginationQuery }>,
  ) => {
    res.status(200).json(await this.service.byAuthor(req.params.id, res.locals.query));
  };

  detail = async (req: Request<RecipeIdParam>, res: Response<RecipeDetails>) => {
    res.status(200).json(await this.service.detail(req.params.id));
  };

  create = async (
    req: Request<Record<string, string>, unknown, CreateRecipeInput>,
    res: Response<RecipeDetails>,
  ) => {
    const ownerId = getAuthUserId(req);
    if (!req.file) {
      throw new UnprocessableEntityError('Validation failed', [
        { path: 'thumb', message: 'Recipe image is required' },
      ]);
    }
    res.status(201).json(await this.service.create(ownerId, req.body, req.file.path));
  };

  delete = async (req: Request<RecipeIdParam>, res: Response<RecipeActionResponse>) => {
    res.status(200).json(await this.service.delete(req.params.id, getAuthUserId(req)));
  };
}
