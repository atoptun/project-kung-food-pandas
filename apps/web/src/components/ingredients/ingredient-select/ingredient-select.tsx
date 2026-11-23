import * as stylex from '@stylexjs/stylex';
import { useId, useMemo } from 'react';

import type { Ingredient } from '@/api/dictionaries';
import { useIngredientsQuery } from '@/api/dictionaries';
import Button from '@/components/shared/button/button';
import Select, { type SelectProps } from '@/components/shared/select/select';
import { typography } from '@/styles/typography.stylex';

import { styles } from './ingredient-select.stylex';

export type IngredientSelectProps = Omit<
  SelectProps,
  'options' | 'aria-label' | 'onValueChange'
> & {
  'aria-label'?: string;
  useSlug?: boolean;
  excludedIds?: readonly string[];
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  onValueChange?: (value: string, ingredient?: Ingredient) => void;
};

export function IngredientSelect({
  disabled,
  placeholder = 'Select an ingredient',
  'aria-label': ariaLabel = 'Ingredient',
  'aria-describedby': describedBy,
  useSlug = false,
  excludedIds = [],
  includeAllOption = false,
  allOptionLabel = 'All ingredients',
  allOptionValue = '',
  onValueChange,
  value,
  ...props
}: IngredientSelectProps) {
  const { data, isPending, isError, refetch } = useIngredientsQuery();
  const statusId = useId();

  const ingredientsMap = useMemo(() => {
    const map = new Map<string, Ingredient>();
    for (const item of data ?? []) {
      map.set(item.id, item);
      if (item.slug) {
        map.set(item.slug, item);
      }
    }
    return map;
  }, [data]);

  const options = useMemo(() => {
    const items = (data ?? [])
      .filter((item) => !excludedIds.includes(item.id))
      .map((item) => ({
        value: useSlug && item.slug ? item.slug : item.id,
        label: item.name,
      }));

    if (includeAllOption) {
      return [{ value: allOptionValue, label: allOptionLabel }, ...items];
    }

    return items;
  }, [data, excludedIds, useSlug, includeAllOption, allOptionValue, allOptionLabel]);

  // Normalize controlled value if passed ID vs Slug
  const normalizedValue = useMemo(() => {
    if (!value || value === allOptionValue) return value;
    const found = ingredientsMap.get(value);
    if (!found) return value;
    return useSlug && found.slug ? found.slug : found.id;
  }, [value, allOptionValue, ingredientsMap, useSlug]);

  const handleValueChange = (selectedValue: string) => {
    const selectedIngredient = ingredientsMap.get(selectedValue);
    onValueChange?.(selectedValue, selectedIngredient);
  };

  const failed = data === undefined && isError;
  const loading = data === undefined && isPending;
  const empty = data !== undefined && options.length === 0;
  const status = failed
    ? 'Unable to load ingredients.'
    : empty
      ? 'No remaining ingredients available.'
      : undefined;

  return (
    <div {...stylex.props(styles.field)}>
      <Select
        {...props}
        value={normalizedValue}
        onValueChange={handleValueChange}
        aria-label={ariaLabel}
        aria-describedby={[describedBy, status && statusId].filter(Boolean).join(' ') || undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading || failed || empty}
        placeholder={loading ? 'Loading ingredients…' : placeholder}
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
        <Button variant="outline" aria-label="Retry ingredients" onClick={() => void refetch()}>
          Retry
        </Button>
      )}
    </div>
  );
}

export default IngredientSelect;
