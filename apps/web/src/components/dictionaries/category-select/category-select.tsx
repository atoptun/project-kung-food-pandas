import { type Ref, useMemo } from 'react';

import type { Category } from '@/api/dictionaries';
import { useCategoriesQuery } from '@/api/dictionaries';
import Select from '@/components/shared/select/select';

export interface CategorySelectProps {
  ref?: Ref<HTMLButtonElement>;
  value: string;
  onValueChange: (id: string, category?: Category) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  ariaLabel?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  visibleItemsCount?: number;
}

export function CategorySelect({
  ref,
  value,
  onValueChange,
  placeholder = 'Select category',
  disabled,
  name,
  ariaLabel = 'Select category',
  includeAllOption = false,
  allOptionLabel = 'All categories',
  visibleItemsCount = 5,
}: CategorySelectProps) {
  const { data: categories = [], isLoading, isError } = useCategoriesQuery();

  const categoriesMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c]));
  }, [categories]);

  const options = useMemo(() => {
    const items = categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));

    if (includeAllOption) {
      return [{ value: '', label: allOptionLabel }, ...items];
    }

    return items;
  }, [categories, includeAllOption, allOptionLabel]);

  const handleValueChange = (selectedId: string) => {
    const selectedCategory = categoriesMap.get(selectedId);
    onValueChange(selectedId, selectedCategory);
  };

  const currentPlaceholder = isLoading
    ? 'Loading categories...'
    : isError
      ? 'Failed to load categories'
      : placeholder;

  return (
    <Select
      ref={ref}
      options={options}
      value={value}
      onValueChange={handleValueChange}
      placeholder={currentPlaceholder}
      disabled={disabled || isLoading || isError}
      name={name}
      aria-label={ariaLabel}
      visibleItemsCount={visibleItemsCount}
    />
  );
}

export default CategorySelect;
