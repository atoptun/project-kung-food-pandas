import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { queryKeys } from '../keys';
import { recipesApi } from './recipes.api';

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

export function useCreateRecipeMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: recipesApi.create,
    onSuccess: (recipe) => {
      client.setQueryData(queryKeys.recipes.detail(recipe.id), recipe);
      void client.invalidateQueries({ queryKey: queryKeys.recipes.lists() });
    },
  });
}
