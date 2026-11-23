import type * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';

import { useCategoriesQuery } from '@/api/dictionaries/dictionaries.queries';
import Loader from '@/components/shared/loader/loader';
import PageHeader from '@/components/shared/page-header/page-header';
import Section from '@/components/shared/section/section';
import { notify } from '@/lib/notify';

import { styles } from './categories.stylex';
import CategoryList from './category-list/category-list';

type CategoriesProps = {
  onSelectCategory: (id: string | null, slug?: string | null) => void;
  xstyle?: stylex.StyleXStyles;
};

export function Categories({ onSelectCategory, xstyle }: CategoriesProps) {
  const { data: categories = [], isLoading, isError } = useCategoriesQuery();

  useEffect(() => {
    if (isError) {
      notify.error('Something went wrong... Please try again later.');
    }
  }, [isError]);

  return (
    <Section withContainer isFirst aria-label="Categories" xstyle={[styles.section, xstyle]}>
      <PageHeader
        title="Categories"
        titleAs="h2"
        subtitle="Discover a variety of delicious recipes tailored to your taste. Explore our categories to find the perfect dish for any occasion."
      />

      {isLoading ? (
        <Loader size="lg" centered label="Loading categories..." />
      ) : (
        <CategoryList categories={categories} onSelectCategory={onSelectCategory} />
      )}
    </Section>
  );
}

export default Categories;
