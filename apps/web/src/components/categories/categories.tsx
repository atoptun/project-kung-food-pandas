import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';

import { useCategoriesQuery } from '@/api/dictionaries/dictionaries.queries';
import Loader from '@/components/shared/loader/loader';
import MainTitle from '@/components/shared/main-title/main-title';
import Section from '@/components/shared/section/section';
import Subtitle from '@/components/shared/subtitle/subtitle';
import { notify } from '@/lib/notify';

import { styles } from './categories.stylex';
import CategoryList from './category-list/category-list';

type CategoriesProps = {
  onSelectCategory: (id: string | null, name?: string) => void;
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
    <Section withContainer aria-label="Categories" xstyle={xstyle}>
      <div {...stylex.props(styles.header)}>
        <MainTitle>Categories</MainTitle>
        <Subtitle>
          Discover a variety of delicious recipes tailored to your taste. Explore our categories to
          find the perfect dish for any occasion.
        </Subtitle>
      </div>

      {isLoading ? (
        <Loader size="lg" centered label="Loading categories..." />
      ) : (
        <CategoryList categories={categories} onSelectCategory={onSelectCategory} />
      )}
    </Section>
  );
}

export default Categories;
