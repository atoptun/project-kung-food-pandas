import * as stylex from '@stylexjs/stylex';

import AddRecipeForm from '@/components/recipes/add-recipe-form/add-recipe-form';
import Breadcrumbs from '@/components/shared/breadcrumbs/breadcrumbs';
import Container from '@/components/shared/container/container';
import { breakpoints, colors } from '@/styles/tokens.stylex';
import { typography } from '@/styles/typography.stylex';

const breadcrumbItems = [{ label: 'home', to: '/' }, { label: 'Add recipe' }];

const styles = stylex.create({
  page: {
    paddingTop: { default: 64, [breakpoints.tablet]: 80 },
  },
  breadcrumbs: {
    marginBottom: { default: 32, [breakpoints.tablet]: 40 },
  },
  intro: {
    marginBottom: { default: 32, [breakpoints.tablet]: 40 },
  },
  title: {
    marginBottom: { default: 16, [breakpoints.tablet]: 20 },
  },
  description: {
    maxWidth: 458,
    color: colors.darkGray,
  },
});

function RecipeAddPage() {
  return (
    <Container xstyle={styles.page}>
      <div {...stylex.props(styles.breadcrumbs)}>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div {...stylex.props(styles.intro)}>
        <h1 {...stylex.props(typography.h2, styles.title)}>Add recipe</h1>
        <p {...stylex.props(styles.description)}>
          Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces
          with us.
        </p>
      </div>
      <AddRecipeForm />
    </Container>
  );
}

export default RecipeAddPage;
