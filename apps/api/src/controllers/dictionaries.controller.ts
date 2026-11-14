import {
  AreasListResponseSchema,
  CategoriesListResponseSchema,
  IngredientsListResponseSchema,
} from '@repo/shared';
import type { NextFunction, Request, Response } from 'express';

import * as dictionariesService from '@/services/dictionaries.service';

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const categories = await dictionariesService.getAllCategories();
    const validatedData = CategoriesListResponseSchema.parse(categories);
    res.status(200).json(validatedData);
  } catch (error) {
    next(error);
  }
};

export const getAreas = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const areas = await dictionariesService.getAllAreas();
    const validatedData = AreasListResponseSchema.parse(areas);
    res.status(200).json(validatedData);
  } catch (error) {
    next(error);
  }
};

export const getIngredients = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ingredients = await dictionariesService.getAllIngredients();
    const validatedData = IngredientsListResponseSchema.parse(ingredients);
    res.status(200).json(validatedData);
  } catch (error) {
    next(error);
  }
};
