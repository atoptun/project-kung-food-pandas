import { queryOptions, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { queryKeys } from '../keys';
import { recipesApi } from './recipes.api';
import type { RecipeFilterQuery } from './recipes.types';

export const recipesListQueryOptions = (filters: RecipeFilterQuery) =>
  queryOptions({
    queryKey: queryKeys.recipes.list(filters),
    queryFn: () => recipesApi.getList(filters),
  });

export const useRecipesQuery = (filters: RecipeFilterQuery, enabled = true) =>
  useQuery({
    ...recipesListQueryOptions(filters),
    enabled,
    // Keep the pagination mounted between pages, but never show cards for an old filter.
    placeholderData: (previous, previousQuery) => {
      const previousFilters = previousQuery?.queryKey[2] as RecipeFilterQuery | undefined;
      return previousFilters?.category === filters.category &&
        previousFilters?.ingredient === filters.ingredient &&
        previousFilters?.area === filters.area
        ? previous
        : undefined;
    },
  });

export const POPULAR_RECIPES_LIMIT = 4;

/** True when the API says the recipe does not exist (404) or the id is malformed (400). */
export function isRecipeNotFoundError(error: unknown) {
  return isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400);
}

export const useRecipeQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.recipes.detail(id ?? ''),
    queryFn: () => recipesApi.getById(id as string),
    enabled: Boolean(id),
    // A missing recipe will not appear on retry; other failures get the default single retry.
    retry: (failureCount, error) => !isRecipeNotFoundError(error) && failureCount < 1,
  });
};

export const usePopularRecipesQuery = (limit = POPULAR_RECIPES_LIMIT) => {
  return useQuery({
    queryKey: queryKeys.recipes.popular(limit),
    queryFn: () => recipesApi.getPopular(limit),
  });
};
