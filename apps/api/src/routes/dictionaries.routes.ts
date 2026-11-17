import { Router } from 'express';

import { getAreas, getCategories, getIngredients } from '@/controllers/dictionaries.controller';

export const dictionariesRouter = Router();

dictionariesRouter.get('/categories', getCategories);
dictionariesRouter.get('/areas', getAreas);
dictionariesRouter.get('/ingredients', getIngredients);
