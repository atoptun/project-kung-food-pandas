import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';

import { useFavorites } from '@/api/favorites/favorites.queries';
import { toRecipeCardProps } from '@/api/recipes/recipes.mappers';
import { usePopularRecipesQuery } from '@/api/recipes/recipes.queries';
import RecipeCard from '@/components/recipes/recipe-card/recipe-card';
import Button from '@/components/shared/button/button';
import { typography } from '@/styles/typography.stylex';

import { styles } from './popular-recipes.stylex';

export function PopularRecipes() {
  const titleId = useId();
  const { data: recipes, isPending, isError, refetch, isFetching } = usePopularRecipesQuery();
  const { isFavorite, isFavoritePending, toggleFavorite } = useFavorites();

  // Nothing to recommend yet — the block is optional, so it is hidden instead of showing a gap.
  if (!isPending && !isError && recipes.length === 0) {
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
                isFavorite={isFavorite(recipe.id)}
                isFavoriteLoading={isFavoritePending(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PopularRecipes;
