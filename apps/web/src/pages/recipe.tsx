import * as stylex from '@stylexjs/stylex';
import { useParams } from 'react-router';

import { useFavorites } from '@/api/favorites/favorites.queries';
import { isRecipeNotFoundError, useRecipeQuery } from '@/api/recipes/recipes.queries';
import PopularRecipes from '@/components/recipes/popular-recipes/popular-recipes';
import RecipeDetails from '@/components/recipes/recipe-details/recipe-details';
import Breadcrumbs from '@/components/shared/breadcrumbs/breadcrumbs';
import Button from '@/components/shared/button/button';
import Container from '@/components/shared/container/container';
import { typography } from '@/styles/typography.stylex';

import { styles } from './recipe.stylex';

const HOME_CRUMB = { label: 'Home', to: '/' } as const;

function RecipeContent({ id }: { id: string | undefined }) {
  const { data: recipe, isPending, isError, error, refetch, isFetching } = useRecipeQuery(id);
  const { isFavorite, isFavoritePending, toggleFavorite } = useFavorites();

  if (!id || (isError && isRecipeNotFoundError(error))) {
    return (
      <>
        <Breadcrumbs items={[HOME_CRUMB, { label: 'Recipe not found' }]} />
        <div {...stylex.props(styles.message)}>
          <h1 {...stylex.props(typography.h3, styles.messageTitle)}>Recipe not found</h1>
          <p {...stylex.props(typography.main, styles.messageText)}>
            This recipe does not exist or has been removed.
          </p>
          <Button to="/">Back to home</Button>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Breadcrumbs items={[HOME_CRUMB, { label: 'Recipe' }]} />
        <div role="alert" {...stylex.props(styles.message)}>
          <h1 {...stylex.props(typography.h3, styles.messageTitle)}>Could not load the recipe</h1>
          <p {...stylex.props(typography.main, styles.messageText)}>
            Please check your connection and try again.
          </p>
          <div {...stylex.props(styles.actions)}>
            <Button disabled={isFetching} onClick={() => void refetch()}>
              Try again
            </Button>
            <Button variant="outline" to="/">
              Back to home
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (isPending) {
    return (
      <>
        <Breadcrumbs items={[HOME_CRUMB, { label: 'Recipe' }]} />
        <p role="status" {...stylex.props(typography.main, styles.messageText)}>
          Loading recipe...
        </p>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[HOME_CRUMB, { label: recipe.title }]} />
      <RecipeDetails
        recipe={recipe}
        isFavorite={isFavorite(recipe.id)}
        isFavoritePending={isFavoritePending(recipe.id)}
        onToggleFavorite={toggleFavorite}
      />
    </>
  );
}

function RecipePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Container xstyle={styles.page}>
      <div {...stylex.props(styles.section)}>
        {/* `key` resets the view state when navigating between recipes (e.g. from Popular recipes). */}
        <RecipeContent key={id} id={id} />
      </div>
      <PopularRecipes />
    </Container>
  );
}

export default RecipePage;
