import * as stylex from '@stylexjs/stylex';
import { useId, useMemo } from 'react';

import type { Category } from '@/api/dictionaries';
import { useCategoriesQuery } from '@/api/dictionaries';
import Button from '@/components/shared/button/button';
import Select, { type SelectProps } from '@/components/shared/select/select';
import { typography } from '@/styles/typography.stylex';

import { styles } from './category-select.stylex';

export type CategorySelectProps = Omit<SelectProps, 'options' | 'aria-label' | 'onValueChange'> & {
  'aria-label'?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  onValueChange?: (value: string, category?: Category) => void;
};

export function CategorySelect({
  disabled,
  placeholder = 'Select a category',
  'aria-label': ariaLabel = 'Category',
  'aria-describedby': describedBy,
  includeAllOption = false,
  allOptionLabel = 'All categories',
  allOptionValue = '',
  onValueChange,
  ...props
}: CategorySelectProps) {
  const { data, isPending, isError, refetch } = useCategoriesQuery();
  const statusId = useId();

  const categoriesMap = useMemo(() => {
    return new Map((data ?? []).map((item) => [item.id, item]));
  }, [data]);

  const options = useMemo(() => {
    const items = (data ?? []).map((item) => ({
      value: item.id,
      label: item.name,
    }));

    if (includeAllOption) {
      return [{ value: allOptionValue, label: allOptionLabel }, ...items];
    }

    return items;
  }, [data, includeAllOption, allOptionValue, allOptionLabel]);

  const handleValueChange = (selectedValue: string) => {
    const selectedCategory = categoriesMap.get(selectedValue);
    onValueChange?.(selectedValue, selectedCategory);
  };

  const failed = data === undefined && isError;
  const loading = data === undefined && isPending;
  const empty = data !== undefined && options.length === 0;
  const status = failed
    ? 'Unable to load categories.'
    : empty
      ? 'No categories available.'
      : undefined;

  return (
    <div {...stylex.props(styles.field)}>
      <Select
        {...props}
        onValueChange={handleValueChange}
        aria-label={ariaLabel}
        aria-describedby={[describedBy, status && statusId].filter(Boolean).join(' ') || undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading || failed || empty}
        placeholder={loading ? 'Loading categories…' : placeholder}
        options={options}
      />
      {status && (
        <p
          id={statusId}
          role={failed ? 'alert' : 'status'}
          {...stylex.props(typography.caption, styles.status)}
        >
          {status}
        </p>
      )}
      {failed && (
        <Button variant="outline" aria-label="Retry categories" onClick={() => void refetch()}>
          Retry
        </Button>
      )}
    </div>
  );
}

export default CategorySelect;
