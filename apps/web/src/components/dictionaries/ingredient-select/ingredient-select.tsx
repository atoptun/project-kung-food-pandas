import { type Ref, useMemo } from 'react';

import type { Ingredient } from '@/api/dictionaries';
import { useIngredientsQuery } from '@/api/dictionaries';
import Select from '@/components/shared/select/select';

export interface IngredientSelectProps {
  ref?: Ref<HTMLButtonElement>;
  value: string;
  onValueChange: (id: string, ingredient?: Ingredient) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  ariaLabel?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  visibleItemsCount?: number;
}

export function IngredientSelect({
  ref,
  value,
  onValueChange,
  placeholder = 'Select ingredient',
  disabled,
  name,
  ariaLabel = 'Select ingredient',
  includeAllOption = false,
  allOptionLabel = 'All ingredients',
  visibleItemsCount = 5,
}: IngredientSelectProps) {
  const { data: ingredients = [], isLoading, isError } = useIngredientsQuery();

  const ingredientsMap = useMemo(() => {
    return new Map(ingredients.map((i) => [i.id, i]));
  }, [ingredients]);

  const options = useMemo(() => {
    const items = ingredients.map((ing) => ({
      value: ing.id,
      label: ing.name,
    }));

    if (includeAllOption) {
      return [{ value: '', label: allOptionLabel }, ...items];
    }

    return items;
  }, [ingredients, includeAllOption, allOptionLabel]);

  const handleValueChange = (selectedId: string) => {
    const selectedIngredient = ingredientsMap.get(selectedId);
    onValueChange(selectedId, selectedIngredient);
  };

  const currentPlaceholder = isLoading
    ? 'Loading ingredients...'
    : isError
      ? 'Failed to load ingredients'
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

export default IngredientSelect;
