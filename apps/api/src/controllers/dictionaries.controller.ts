import type { Area, Category, Ingredient } from '@repo/shared';
import type { Request, Response } from 'express';

import type { DictionariesService } from '@/services/dictionaries.service';

const CACHE_HEADER = 'public, max-age=3600, stale-while-revalidate=86400';

export class DictionariesController {
  constructor(private service: DictionariesService) {}

  getCategories = async (_req: Request, res: Response<Category[]>): Promise<void> => {
    res.setHeader('Cache-Control', CACHE_HEADER);
    const categories = await this.service.getCategories();
    res.status(200).json(categories);
  };

  getAreas = async (_req: Request, res: Response<Area[]>): Promise<void> => {
    res.setHeader('Cache-Control', CACHE_HEADER);
    const areas = await this.service.getAreas();
    res.status(200).json(areas);
  };

  getIngredients = async (_req: Request, res: Response<Ingredient[]>): Promise<void> => {
    res.setHeader('Cache-Control', CACHE_HEADER);
    const ingredients = await this.service.getIngredients();
    res.status(200).json(ingredients);
  };
}
