import * as stylex from '@stylexjs/stylex';

import { isRecipeNotFoundError, useRecipeQuery } from '@/api/recipes/recipes.queries';
import RecipeDetails from '@/components/recipes/recipe-details/recipe-details';
import type { BreadcrumbItem } from '@/components/shared/breadcrumbs/breadcrumbs';
import Button from '@/components/shared/button/button';
import PageHeader from '@/components/shared/page-header/page-header';
import Section from '@/components/shared/section/section';
import { typography } from '@/styles/typography.stylex';

import PopularRecipes from '../popular-recipes/popular-recipes';
import { styles } from './recipe-view.stylex';

const HOME_CRUMB: BreadcrumbItem = { label: 'Home', to: '/' };

export interface RecipeViewProps {
  id: string | undefined;
}

export function RecipeView({ id }: RecipeViewProps) {
  const { data: recipe, isPending, isError, error, refetch, isFetching } = useRecipeQuery(id);

  const breadcrumbs: BreadcrumbItem[] = [
    HOME_CRUMB,
    {
      label:
        !id || (isError && isRecipeNotFoundError(error))
          ? 'Recipe not found'
          : (recipe?.title ?? 'Recipe'),
    },
  ];

  return (
    <>
      <Section isFirst withContainer aria-label="Recipe details" containerXstyle={styles.section}>
        <PageHeader breadcrumbs={breadcrumbs} />

        {(!id || (isError && isRecipeNotFoundError(error))) && <RecipeNotFound />}

        {id && isError && !isRecipeNotFoundError(error) && (
          <RecipeError isFetching={isFetching} onRetry={() => void refetch()} />
        )}

        {isPending && (
          <p role="status" {...stylex.props(typography.main, styles.messageText)}>
            Loading recipe...
          </p>
        )}

        {recipe && <RecipeDetails recipe={recipe} />}
      </Section>

      <PopularRecipes excludeId={id} />
    </>
  );
}

function RecipeNotFound() {
  return (
    <div {...stylex.props(styles.message)}>
      <h1 {...stylex.props(typography.h3, styles.messageTitle)}>Recipe not found</h1>
      <p {...stylex.props(typography.main, styles.messageText)}>
        This recipe does not exist or has been removed.
      </p>
      <Button to="/">Back to home</Button>
    </div>
  );
}

function RecipeError({ isFetching, onRetry }: { isFetching: boolean; onRetry: () => void }) {
  return (
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
  );
}

export default RecipeView;
