import { type Ref, useMemo } from 'react';

import type { Area } from '@/api/dictionaries';
import { useAreasQuery } from '@/api/dictionaries';
import Select from '@/components/shared/select/select';

export interface AreaSelectProps {
  ref?: Ref<HTMLButtonElement>;
  value: string;
  onValueChange: (id: string, area?: Area) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  ariaLabel?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  visibleItemsCount?: number;
}

export function AreaSelect({
  ref,
  value,
  onValueChange,
  placeholder = 'Select area',
  disabled,
  name,
  ariaLabel = 'Select area',
  includeAllOption = false,
  allOptionLabel = 'All areas',
  visibleItemsCount = 5,
}: AreaSelectProps) {
  const { data: areas = [], isLoading, isError } = useAreasQuery();

  const areasMap = useMemo(() => {
    return new Map(areas.map((a) => [a.id, a]));
  }, [areas]);

  const options = useMemo(() => {
    const items = areas.map((area) => ({
      value: area.id,
      label: area.name,
    }));

    if (includeAllOption) {
      return [{ value: '', label: allOptionLabel }, ...items];
    }

    return items;
  }, [areas, includeAllOption, allOptionLabel]);

  const handleValueChange = (selectedId: string) => {
    const selectedArea = areasMap.get(selectedId);
    onValueChange(selectedId, selectedArea);
  };

  const currentPlaceholder = isLoading
    ? 'Loading areas...'
    : isError
      ? 'Failed to load areas'
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

export default AreaSelect;
