import * as stylex from '@stylexjs/stylex';

import RecipeFilters from '@/components/recipes/recipe-filters/recipe-filters';
import RecipeList from '@/components/recipes/recipe-list/recipe-list';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import Loader from '@/components/shared/loader/loader';
import MainTitle from '@/components/shared/main-title/main-title';
import Pagination from '@/components/shared/pagination/pagination';
import Section from '@/components/shared/section/section';
import Subtitle from '@/components/shared/subtitle/subtitle';
import { typography, weights } from '@/styles/typography.stylex';

import { styles } from './recipes-catalog.stylex';
import { useCatalogRecipes } from './use-catalog-recipes';

export type Category = {
  id: string | null;
  name: string;
};

export type RecipesCatalogProps = {
  category?: Category;
  onBack: () => void;
  xstyle?: stylex.StyleXStyles;
};

export function RecipesCatalog({
  category = { id: null, name: 'All categories' },
  onBack,
  xstyle,
}: RecipesCatalogProps) {
  const {
    recipes,
    totalPages,
    page,
    areaId,
    ingredientId,
    isLoading,
    isError,
    isFetching,
    refetch,
    setAreaId,
    setIngredientId,
    setPage,
  } = useCatalogRecipes({ categoryId: category.id });

  return (
    <Section withContainer isFirst aria-label="Recipes catalog" xstyle={[styles.section, xstyle]}>
      <div {...stylex.props(styles.grid)}>
        {/* Top area: Back button + Title & Subtitle */}
        <div {...stylex.props(styles.topArea)}>
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to categories"
            {...stylex.props(styles.backButton)}
          >
            <Icon name="arrow-up-right" size={16} xstyle={styles.backIcon} />
            <span {...stylex.props(typography.caption, weights.bold, styles.backText)}>Back</span>
          </button>

          <MainTitle>{category.name}</MainTitle>
          <Subtitle>
            Discover a variety of delicious recipes tailored to your taste. Explore our collection
            to find the perfect dish for any occasion.
          </Subtitle>
        </div>

        {/* Filters area */}
        <div {...stylex.props(styles.filtersArea)}>
          <RecipeFilters
            ingredientId={ingredientId}
            areaId={areaId}
            onIngredientChange={setIngredientId}
            onAreaChange={setAreaId}
          />
        </div>

        {/* Recipes area: list + pagination */}
        <div {...stylex.props(styles.recipesArea)}>
          {isLoading ? (
            <Loader size="lg" centered label="Loading recipes..." />
          ) : isError ? (
            <div role="alert" {...stylex.props(styles.error)}>
              <p {...stylex.props(typography.main)}>Could not load recipes. Please try again.</p>
              <Button disabled={isFetching} onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          ) : recipes.length === 0 ? (
            <div role="status" {...stylex.props(styles.empty)}>
              <p {...stylex.props(typography.h4, weights.bold)}>No recipes found</p>
              <p {...stylex.props(typography.main)}>
                Try adjusting or clearing your filters to see more delicious results.
              </p>
            </div>
          ) : (
            <>
              <RecipeList recipes={recipes} />

              {totalPages > 1 && (
                <div {...stylex.props(styles.paginationWrapper)}>
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

export default RecipesCatalog;
