import type { Area, Category, Ingredient } from '@repo/shared';
import { http, HttpResponse } from 'msw';

import areas from '@/mocks/data/areas.json';
import categories from '@/mocks/data/categories.json';
import ingredients from '@/mocks/data/ingredients.json';

// Fixtures from apps/api/prisma/data/foodies, verified against the assignment MongoDB/CSV sources.
// Seed mapping: _id.$oid -> id (categories/areas); _id -> id and desc -> description (ingredients).
export const dictionariesHandlers = [
  http.get('*/categories', () => HttpResponse.json<Category[]>(categories)),
  http.get('*/areas', () => HttpResponse.json<Area[]>(areas)),
  http.get('*/ingredients', () => HttpResponse.json<Ingredient[]>(ingredients)),
];
