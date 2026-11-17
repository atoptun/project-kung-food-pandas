import type { Category } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { useCategoriesQuery } from '@/api/categories/categories.queries';
import { useFavorites } from '@/api/favorites/favorites.queries';
import { toRecipeCardProps } from '@/api/recipes/recipes.mappers';
import { recipesListQueryOptions, useRecipesQuery } from '@/api/recipes/recipes.queries';
import type { RecipeFilterQuery } from '@/api/recipes/recipes.types';
import AreaSelect from '@/components/areas/area-select/area-select';
import { CategoryImage } from '@/components/categories/category-image/category-image';
import IngredientSelect from '@/components/ingredients/ingredient-select/ingredient-select';
import RecipeCard from '@/components/recipes/recipe-card/recipe-card';
import Button from '@/components/shared/button/button';
import Container from '@/components/shared/container/container';
import Icon from '@/components/shared/icon/icon';
import Pagination from '@/components/shared/pagination/pagination';
import { notify } from '@/lib/notify';
import { typography } from '@/styles/typography.stylex';
import { getErrorMessage } from '@/utils/error-message';

import { styles } from './home.stylex';

const categoryNames = [
  'Beef',
  'Breakfast',
  'Dessert',
  'Lamb',
  'Goat',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
];
// The dictionary contract allows image to be absent. These existing design assets
// keep the catalog usable with that response, without another image service.
const categoryImages: Record<string, string> = {
  Beef: new URL('../../assets/categories/beef@2x.jpg', import.meta.url).href,
  Breakfast: new URL('../../assets/categories/breakfast@2x.jpg', import.meta.url).href,
  Dessert: new URL('../../assets/categories/desserts@2x.jpg', import.meta.url).href,
  Lamb: new URL('../../assets/categories/lamb@2x.jpg', import.meta.url).href,
  Goat: new URL('../../assets/categories/goat@2x.jpg', import.meta.url).href,
  Miscellaneous: new URL('../../assets/categories/miscellaneous@2x.jpg', import.meta.url).href,
  Pasta: new URL('../../assets/categories/pasta@2x.jpg', import.meta.url).href,
  Pork: new URL('../../assets/categories/pork@2x.jpg', import.meta.url).href,
  Seafood: new URL('../../assets/categories/seafood@2x.jpg', import.meta.url).href,
  Side: new URL('../../assets/categories/side@2x.jpg', import.meta.url).href,
  Starter: new URL('../../assets/categories/starter@2x.jpg', import.meta.url).href,
};
const subtitle =
  'Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen.';
const dessertsSubtitle =
  'Go on a taste journey, where every sip is a sophisticated creative chord, and every dessert is an expression of the most refined gastronomic desires.';
const initialFilters: RecipeFilterQuery = { page: 1, limit: 12 };
const categoryTitle = (category: Category | null) =>
  category?.name === 'Dessert' ? 'Desserts' : (category?.name ?? 'All categories');

export default function RecipeCatalog() {
  // Undefined shows categories; null is the unfiltered All categories catalog.
  const [category, setCategory] = useState<Category | null | undefined>();
  const [filters, setFilters] = useState<RecipeFilterQuery>(initialFilters);
  const [opening, setOpening] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const didNavigate = useRef(false);
  const queryClient = useQueryClient();
  const categories = useCategoriesQuery();
  const recipes = useRecipesQuery(filters, category !== undefined);
  const { isFavorite, isFavoritePending, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (didNavigate.current) {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [category]);

  async function openCategory(nextCategory: Category | null) {
    if (opening !== null) return;
    const nextFilters = { ...initialFilters, ...(nextCategory && { category: nextCategory.id }) };
    setOpening(nextCategory?.id ?? 'all');
    setSelectionError(null);
    try {
      await queryClient.fetchQuery(recipesListQueryOptions(nextFilters));
      setFilters(nextFilters);
      didNavigate.current = true;
      setCategory(nextCategory);
    } catch (error) {
      const message = getErrorMessage(error);
      setSelectionError(message);
      notify.error(message);
    } finally {
      setOpening(null);
    }
  }

  function changeFilter(name: 'ingredient' | 'area', value: string) {
    setFilters((current) => ({ ...current, [name]: value || undefined, page: 1 }));
  }

  const visibleCategories = categoryNames.flatMap(
    (name) => categories.data?.filter((item) => item.name === name) ?? [],
  );

  return (
    <Container>
      <section aria-labelledby="catalog-title" {...stylex.props(styles.catalog)}>
        {category !== undefined && (
          <Button
            variant="outline"
            xstyle={styles.back}
            onClick={() => {
              didNavigate.current = true;
              setCategory(undefined);
              setFilters(initialFilters);
            }}
          >
            <Icon name="arrow-up-right" size={16} xstyle={styles.backArrow} /> Back
          </Button>
        )}
        <h2
          ref={headingRef}
          id="catalog-title"
          tabIndex={-1}
          {...stylex.props(typography.h2, styles.title)}
        >
          {category === undefined ? 'Categories' : categoryTitle(category)}
        </h2>
        <p {...stylex.props(typography.main, styles.subtitle)}>
          {category?.name === 'Dessert' ? dessertsSubtitle : subtitle}
        </p>

        {category === undefined ? (
          <>
            {categories.isPending && (
              <p role="status" {...stylex.props(styles.status)}>
                Loading categories…
              </p>
            )}
            {categories.isError && (
              <div role="alert" {...stylex.props(styles.status)}>
                <p>Could not load categories.</p>
                <Button
                  variant="outline"
                  disabled={categories.isFetching}
                  onClick={() => void categories.refetch()}
                >
                  Try again
                </Button>
              </div>
            )}
            {categories.data?.length === 0 && (
              <p role="status" {...stylex.props(styles.status)}>
                No categories available.
              </p>
            )}
            {selectionError && (
              <p role="alert" {...stylex.props(styles.status)}>
                {selectionError}
              </p>
            )}
            {opening !== null && <p role="status">Loading recipes…</p>}
            {categories.data && categories.data.length > 0 && (
              <ul aria-busy={opening !== null} {...stylex.props(styles.categories)}>
                {visibleCategories.map((item, index) => {
                  return (
                    <li
                      key={item.id}
                      {...stylex.props(
                        styles.categoryItem,
                        index > 7 && styles.categoryTablet,
                        (index === 2 || index === 7) && styles.categoryWideTablet,
                        (index === 2 || index === 3 || index === 7 || index === 9) &&
                          styles.categoryWideDesktop,
                      )}
                    >
                      <button
                        type="button"
                        disabled={opening !== null}
                        aria-label={`Browse ${categoryTitle(item)} recipes`}
                        onClick={() => void openCategory(item)}
                        {...stylex.props(styles.categoryButton)}
                      >
                        <CategoryImage src={item.image || categoryImages[item.name]!} alt="" />
                        <span {...stylex.props(styles.categoryLabel)}>
                          <span {...stylex.props(styles.categoryName)}>{categoryTitle(item)}</span>
                          <span {...stylex.props(styles.categoryArrow)}>
                            <Icon name="arrow-up-right" />
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                <li {...stylex.props(styles.categoryItem)}>
                  <button
                    type="button"
                    disabled={opening !== null}
                    onClick={() => void openCategory(null)}
                    {...stylex.props(styles.categoryButton, styles.allCategories)}
                  >
                    All categories
                  </button>
                </li>
              </ul>
            )}
          </>
        ) : (
          <div {...stylex.props(styles.catalogBody)}>
            <div role="group" aria-label="Recipe filters" {...stylex.props(styles.filters)}>
              <IngredientSelect
                value={filters.ingredient ?? ''}
                placeholder="Ingredients"
                onValueChange={(value) => changeFilter('ingredient', value)}
                xstyle={styles.filter}
              />
              <AreaSelect
                value={filters.area ?? ''}
                placeholder="Area"
                onValueChange={(value) => changeFilter('area', value)}
                xstyle={styles.filter}
              />
              {(filters.ingredient || filters.area) && (
                <Button
                  variant="outline"
                  xstyle={styles.clearFilters}
                  onClick={() => setFilters({ ...initialFilters, category: filters.category })}
                >
                  Reset filters
                </Button>
              )}
            </div>
            <div aria-busy={recipes.isFetching} {...stylex.props(styles.results)}>
              {recipes.isPending && <p role="status">Loading recipes…</p>}
              {recipes.isPlaceholderData && <p role="status">Loading recipes…</p>}
              {recipes.isError && (
                <div role="alert" {...stylex.props(styles.status)}>
                  <p>Could not load recipes.</p>
                  <Button
                    variant="outline"
                    disabled={recipes.isFetching}
                    onClick={() => void recipes.refetch()}
                  >
                    Try again
                  </Button>
                </div>
              )}
              {recipes.data?.items.length === 0 && (
                <p role="status">No recipes found. Try changing the filters.</p>
              )}
              {recipes.data && (
                <>
                  <ul {...stylex.props(styles.recipes)}>
                    {recipes.data.items.map((recipe) => (
                      <li key={recipe.id} {...stylex.props(styles.recipeItem)}>
                        <RecipeCard
                          {...toRecipeCardProps(recipe)}
                          isFavorite={isFavorite(recipe.id)}
                          isFavoriteLoading={isFavoritePending(recipe.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      </li>
                    ))}
                  </ul>
                  {recipes.data.items.length > 0 && (
                    <div {...stylex.props(styles.pagination)}>
                      <Pagination
                        page={filters.page}
                        totalPages={recipes.data.totalPages}
                        onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </Container>
  );
}
