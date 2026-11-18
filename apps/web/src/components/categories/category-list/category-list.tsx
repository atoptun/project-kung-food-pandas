import type { Category } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';

import CategoryCard from '../category-card/category-card';
import { styles } from './category-list.stylex';

type CategoryListProps = {
  categories: Category[];
  onSelectCategory: (id: string | null) => void;
  xstyle?: stylex.StyleXStyles;
};

export function CategoryList({ categories, onSelectCategory, xstyle }: CategoryListProps) {
  const visibleCategories = categories.slice(0, 11);

  const allItems: Array<Partial<Category>> = [
    ...visibleCategories,
    { id: null as unknown as string, name: 'All categories' },
  ];

  return (
    <div {...stylex.props(styles.grid, xstyle)}>
      {allItems.map((item, index) => {
        const isHiddenOnMobile = index >= 7 && index < allItems.length - 1;
        return (
          <CategoryCard
            key={item.id ?? 'all-categories'}
            id={item.id}
            name={item.name ?? 'All categories'}
            image={item.image}
            onSelect={onSelectCategory}
            xstyle={[getItemStyle(index), isHiddenOnMobile && styles.hiddenOnMobile]}
          />
        );
      })}
    </div>
  );
}

export default CategoryList;

function getItemStyle(index: number) {
  // Індекси 2 та 7 — широкі і на таблеті (span 2), і на десктопі (span 7)
  if (index === 2 || index === 7) {
    return styles.itemWideBoth;
  }
  // Індекси 3 та 9 — широкі тільки на десктопі (span 7), на таблеті звичайні (span 1)
  if (index === 3 || index === 9) {
    return styles.itemWideDesktopOnly;
  }
  // Усі інші (0, 1, 4, 5, 6, 8, 10, 11) — звичайні на таблеті (span 1) і вузькі на десктопі (span 4)
  return styles.itemDefault;
}
