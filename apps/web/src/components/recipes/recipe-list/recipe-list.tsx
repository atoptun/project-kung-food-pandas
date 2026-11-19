import * as stylex from '@stylexjs/stylex';

import { useFavorites } from '@/api/favorites/favorites.queries';
import { toRecipeCardProps } from '@/api/recipes/recipes.mappers';
import type { RecipeCard as RecipeCardData } from '@/api/recipes/recipes.types';
import RecipeCard from '@/components/recipes/recipe-card/recipe-card';

import { styles } from './recipe-list.stylex';

export type RecipeListProps = {
  recipes: RecipeCardData[];
  xstyle?: stylex.StyleXStyles;
};

export function RecipeList({ recipes, xstyle }: RecipeListProps) {
  const { isFavorite, isFavoritePending, toggleFavorite } = useFavorites();

  return (
    <ul {...stylex.props(styles.list, xstyle)}>
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
  );
}

export default RecipeList;
