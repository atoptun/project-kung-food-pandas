import { useRecipesQuery } from '@/api/recipes/recipes.queries';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useRecipeFiltersStore } from '@/stores/recipe-filters.store';

export type UseCatalogRecipesProps = {
  categoryId?: string | null;
};

export function useCatalogRecipes({ categoryId }: UseCatalogRecipesProps = {}) {
  const { page, areaId, ingredientId, setAreaId, setIngredientId, setPage, resetFilters } =
    useRecipeFiltersStore();

  const isMobile = useMediaQuery('(max-width: 767px)');
  const limit = isMobile ? 8 : 12;

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
