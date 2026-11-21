import * as stylex from '@stylexjs/stylex';

import AddRecipeForm from '@/components/recipes/add-recipe-form/add-recipe-form';
import PageHeader from '@/components/shared/page-header/page-header';
import Section from '@/components/shared/section/section';
import { breakpoints } from '@/styles/tokens.stylex';

const breadcrumbItems = [{ label: 'Home', to: '/' }, { label: 'Add recipe' }];

const styles = stylex.create({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 32, [breakpoints.tablet]: 40 },
  },
});

function RecipeAddPage() {
  return (
    <Section isFirst withContainer aria-label="Add recipe" containerXstyle={styles.content}>
      <PageHeader
        breadcrumbs={breadcrumbItems}
        title="Add recipe"
        subtitle="Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us."
      />
      <AddRecipeForm />
    </Section>
  );
}

export default RecipeAddPage;
