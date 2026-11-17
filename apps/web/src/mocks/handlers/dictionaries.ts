import type { Area, Category, Ingredient } from '@repo/shared';
import { delay, http, HttpResponse } from 'msw';

import areasData from '../data/areas.json';
import categoriesData from '../data/categories.json';
import ingredientsData from '../data/ingredients.json';

export const dictionariesHandlers = [
  http.get('*/categories', async () => {
    await delay(150);
    return HttpResponse.json<Category[]>(categoriesData as Category[]);
  }),

  http.get('*/areas', async () => {
    await delay(150);
    return HttpResponse.json<Area[]>(areasData as Area[]);
  }),

  http.get('*/ingredients', async () => {
    await delay(150);
    return HttpResponse.json<Ingredient[]>(ingredientsData as Ingredient[]);
  }),
];
