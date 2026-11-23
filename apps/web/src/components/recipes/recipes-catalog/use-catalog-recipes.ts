import { useSearchParams } from 'react-router';

import { useRecipesQuery } from '@/api/recipes/recipes.queries';
import { useMediaQuery } from '@/hooks/use-media-query';

export type UseCatalogRecipesProps = {
  categoryId?: string | null;
};

export function useCatalogRecipes({ categoryId }: UseCatalogRecipesProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const areaId = searchParams.get('area') || '';
  const ingredientId = searchParams.get('ingredient') || '';

  const isMobile = useMediaQuery('(max-width: 767px)');
  const limit = isMobile ? 8 : 12;

  const updateFilters = (newParams: Record<string, string | null>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, val] of Object.entries(newParams)) {
          if (!val || (key === 'page' && val === '1')) {
            next.delete(key);
          } else {
            next.set(key, val);
          }
        }
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  const setAreaId = (area: string) => updateFilters({ area: area || null, page: '1' });
  const setIngredientId = (ingredient: string) =>
    updateFilters({ ingredient: ingredient || null, page: '1' });
  const setPage = (newPage: number) => updateFilters({ page: String(newPage) });
  const resetFilters = () => updateFilters({ area: null, ingredient: null, page: '1' });

  const { data, isLoading, isError, refetch, isFetching } = useRecipesQuery({
    category: categoryId || undefined,
    area: areaId || undefined,
    ingredient: ingredientId || undefined,
    page,
    limit,
  });

  return {
    recipes: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    page,
    limit,
    areaId,
    ingredientId,
    isLoading,
    isError,
    isFetching,
    refetch,
    setAreaId,
    setIngredientId,
    setPage,
    resetFilters,
  };
}

export default useCatalogRecipes;
