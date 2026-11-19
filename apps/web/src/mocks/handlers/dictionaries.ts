import type { Area, Category, Ingredient } from '@repo/shared';
import { http, HttpResponse } from 'msw';

import areasData from '../data/areas.json';
import categoriesData from '../data/categories.json';
import ingredientsData from '../data/ingredients.json';

export const dictionariesHandlers = [
  http.get('*/categories', async () => {
    return HttpResponse.json<Category[]>(categoriesData);
  }),

  http.get('*/areas', async () => {
    return HttpResponse.json<Area[]>(areasData);
  }),

  http.get('*/ingredients', async () => {
    return HttpResponse.json<Ingredient[]>(ingredientsData);
  }),
];
