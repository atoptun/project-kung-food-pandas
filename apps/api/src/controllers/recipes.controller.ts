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

import { getAuthUserId } from '@/middlewares/auth.middleware';
import type { RecipesService } from '@/services/recipes.service';

export class RecipesController {
  constructor(private service: RecipesService) {}

  list = async (req: Request, res: Response<RecipesListResponse, { query: RecipeFilterQuery }>) => {
    const recipes = await this.service.list(res.locals.query, req.user?.id);
    res.status(200).json(recipes);
  };

  listPopular = async (
    req: Request,
    res: Response<RecipeCard[], { query: PopularRecipesQuery }>,
  ) => {
    const recipes = await this.service.listPopular(res.locals.query.limit, req.user?.id);
    res.status(200).json(recipes);
  };

  listOwn = async (
    req: Request,
    res: Response<RecipesListResponse, { query: PaginationQuery }>,
  ) => {
    const recipes = await this.service.listOwn(getAuthUserId(req), res.locals.query);
    res.status(200).json(recipes);
  };

  listByUser = async (
    req: Request<UserIdParam>,
    res: Response<UserRecipesListResponse, { query: PaginationQuery }>,
  ) => {
    const recipes = await this.service.listByUser(req.params.id, res.locals.query);
    res.status(200).json(recipes);
  };

  getById = async (req: Request<RecipeIdParam>, res: Response<RecipeDetails>) => {
    const recipe = await this.service.getById(req.params.id, req.user?.id);
    res.status(200).json(recipe);
  };

  create = async (
    req: Request<Record<string, string>, RecipeDetails, CreateRecipeInput>,
    res: Response<RecipeDetails>,
  ) => {
    const recipe = await this.service.create(getAuthUserId(req), req.body, req.file?.buffer);
    res.status(201).json(recipe);
  };

  remove = async (req: Request<RecipeIdParam>, res: Response<RecipeActionResponse>) => {
    const result = await this.service.remove(getAuthUserId(req), req.params.id);
    res.status(200).json(result);
  };
}
