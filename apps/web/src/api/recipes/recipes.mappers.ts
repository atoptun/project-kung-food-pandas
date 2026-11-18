import type { RecipeCardProps } from '@/components/recipes/recipe-card/recipe-card';

import type { RecipeCard } from './recipes.types';

type RecipeCardDataProps = Pick<
  RecipeCardProps,
  'id' | 'title' | 'description' | 'image' | 'author'
>;

/** Maps the API card contract (`thumb`, `owner`) to the props of the shared RecipeCard. */
export function toRecipeCardProps(recipe: RecipeCard): RecipeCardDataProps {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? '',
    image: recipe.thumb,
    author: {
      id: recipe.owner?.id ?? '',
      name: recipe.owner?.name ?? 'Unknown author',
      avatar: recipe.owner?.avatar,
    },
  };
}
