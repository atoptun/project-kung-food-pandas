import * as stylex from '@stylexjs/stylex';

import { isRecipeNotFoundError, useRecipeQuery } from '@/api/recipes/recipes.queries';
import RecipeDetails from '@/components/recipes/recipe-details/recipe-details';
import Breadcrumbs from '@/components/shared/breadcrumbs/breadcrumbs';
import Button from '@/components/shared/button/button';
import Container from '@/components/shared/container/container';
import { typography } from '@/styles/typography.stylex';

import PopularRecipes from '../popular-recipes/popular-recipes';
import { styles } from './recipe-view.stylex';

const HOME_CRUMB = { label: 'Home', to: '/' } as const;

export interface RecipeViewProps {
  id: string | undefined;
}

export function RecipeView({ id }: RecipeViewProps) {
  const { data: recipe, isPending, isError, error, refetch, isFetching } = useRecipeQuery(id);

  if (!id || (isError && isRecipeNotFoundError(error))) {
    return (
      <Container xstyle={styles.page}>
        <div {...stylex.props(styles.section)}>
          <Breadcrumbs items={[HOME_CRUMB, { label: 'Recipe not found' }]} />
          <RecipeNotFound />
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container xstyle={styles.page}>
        <div {...stylex.props(styles.section)}>
          <Breadcrumbs items={[HOME_CRUMB, { label: 'Recipe' }]} />
          <RecipeError isFetching={isFetching} onRetry={() => void refetch()} />
        </div>
      </Container>
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
    <Container xstyle={styles.page}>
      <div {...stylex.props(styles.section)}>
        <Breadcrumbs items={[HOME_CRUMB, { label: recipe.title }]} />
        <RecipeDetails recipe={recipe} />
      </div>
      <PopularRecipes excludeId={id} />
    </Container>
  );
}

function RecipeNotFound() {
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

function RecipeError({ isFetching, onRetry }: { isFetching: boolean; onRetry: () => void }) {
  return (
    <>
      <Breadcrumbs items={[HOME_CRUMB, { label: 'Recipe' }]} />
      <div role="alert" {...stylex.props(styles.message)}>
        <h1 {...stylex.props(typography.h3, styles.messageTitle)}>Could not load the recipe</h1>
        <p {...stylex.props(typography.main, styles.messageText)}>
          Please check your connection and try again.
        </p>
        <div {...stylex.props(styles.actions)}>
          <Button disabled={isFetching} onClick={onRetry}>
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

export default RecipeView;
