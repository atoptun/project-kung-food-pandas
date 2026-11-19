import { useRefreshRecipesOnSessionChange } from '@/api/recipes/recipes.session';

/** Refetches viewer-specific recipe data (`isFavorite`) when the signed-in user changes. */
function RecipesSessionSync() {
  useRefreshRecipesOnSessionChange();
  return null;
}

export default RecipesSessionSync;
