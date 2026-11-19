import { Router } from 'express';

import { DictionariesController } from '@/controllers/dictionaries.controller';
import prisma from '@/lib/prisma';
import { DictionariesService } from '@/services/dictionaries.service';

const service = new DictionariesService(prisma);
const controller = new DictionariesController(service);

export const dictionariesRouter: Router = Router();

dictionariesRouter.get('/categories', controller.getCategories);
dictionariesRouter.get('/areas', controller.getAreas);
dictionariesRouter.get('/ingredients', controller.getIngredients);
