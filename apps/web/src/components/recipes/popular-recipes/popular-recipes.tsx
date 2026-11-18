import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';

import { useFavorites } from '@/api/favorites/favorites.queries';
import { toRecipeCardProps } from '@/api/recipes/recipes.mappers';
import { POPULAR_RECIPES_LIMIT, usePopularRecipesQuery } from '@/api/recipes/recipes.queries';
import RecipeCard from '@/components/recipes/recipe-card/recipe-card';
import Button from '@/components/shared/button/button';
import { typography } from '@/styles/typography.stylex';

import { styles } from './popular-recipes.stylex';

export interface PopularRecipesProps {
  /** Recipe opened on the current page; it is not repeated among the popular cards. */
  excludeId?: string;
}

export function PopularRecipes({ excludeId }: PopularRecipesProps) {
  const titleId = useId();
  // One extra item keeps the block full when the current recipe is popular itself.
  const { data, isPending, isError, refetch, isFetching } = usePopularRecipesQuery(
    POPULAR_RECIPES_LIMIT + 1,
  );
  const recipes = data?.filter((recipe) => recipe.id !== excludeId).slice(0, POPULAR_RECIPES_LIMIT);
  const { isFavorite, isFavoritePending, toggleFavorite } = useFavorites();

  // Nothing to recommend yet — the block is optional, so it is hidden instead of showing a gap.
  if (!isPending && !isError && recipes?.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={titleId} {...stylex.props(styles.section)}>
      <h2 id={titleId} {...stylex.props(typography.h3, styles.title)}>
        Popular recipes
      </h2>

      {isPending && (
        <p role="status" {...stylex.props(typography.main, styles.status)}>
          Loading popular recipes...
        </p>
      )}

      {isError && (
        <div role="alert" {...stylex.props(styles.error)}>
          <p {...stylex.props(typography.main, styles.status)}>Could not load popular recipes.</p>
          <Button variant="outline" disabled={isFetching} onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {recipes && recipes.length > 0 && (
        <ul {...stylex.props(styles.list)}>
          {recipes.map((recipe) => (
            <li key={recipe.id} {...stylex.props(styles.item)}>
              <RecipeCard
                {...toRecipeCardProps(recipe)}
                isFavorite={isFavorite(recipe)}
                isFavoriteLoading={isFavoritePending(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PopularRecipes;
