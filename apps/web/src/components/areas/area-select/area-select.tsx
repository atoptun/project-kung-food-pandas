import * as stylex from '@stylexjs/stylex';
import { useId, useMemo } from 'react';

import type { Area } from '@/api/dictionaries';
import { useAreasQuery } from '@/api/dictionaries';
import Button from '@/components/shared/button/button';
import Select, { type SelectProps } from '@/components/shared/select/select';
import { typography } from '@/styles/typography.stylex';

import { styles } from './area-select.stylex';

export type AreaSelectProps = Omit<SelectProps, 'options' | 'aria-label' | 'onValueChange'> & {
  'aria-label'?: string;
  useSlug?: boolean;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  onValueChange?: (value: string, area?: Area) => void;
};

export function AreaSelect({
  disabled,
  placeholder = 'Select an area',
  'aria-label': ariaLabel = 'Area',
  'aria-describedby': describedBy,
  useSlug = false,
  includeAllOption = false,
  allOptionLabel = 'All areas',
  allOptionValue = '',
  onValueChange,
  value,
  ...props
}: AreaSelectProps) {
  const { data, isPending, isError, refetch } = useAreasQuery();
  const statusId = useId();

  const areasMap = useMemo(() => {
    const map = new Map<string, Area>();
    for (const item of data ?? []) {
      map.set(item.id, item);
      if (item.slug) {
        map.set(item.slug, item);
      }
    }
    return map;
  }, [data]);

  const options = useMemo(() => {
    const items = (data ?? []).map((item) => ({
      value: useSlug && item.slug ? item.slug : item.id,
      label: item.name,
    }));

    if (includeAllOption) {
      return [{ value: allOptionValue, label: allOptionLabel }, ...items];
    }

    return items;
  }, [data, useSlug, includeAllOption, allOptionValue, allOptionLabel]);

  // Normalize controlled value if passed ID vs Slug
  const normalizedValue = useMemo(() => {
    if (!value || value === allOptionValue) return value;
    const found = areasMap.get(value);
    if (!found) return value;
    return useSlug && found.slug ? found.slug : found.id;
  }, [value, allOptionValue, areasMap, useSlug]);

  const handleValueChange = (selectedValue: string) => {
    const selectedArea = areasMap.get(selectedValue);
    onValueChange?.(selectedValue, selectedArea);
  };

  const failed = data === undefined && isError;
  const loading = data === undefined && isPending;
  const empty = data !== undefined && options.length === 0;
  const status = failed ? 'Unable to load areas.' : empty ? 'No areas available.' : undefined;

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
        placeholder={loading ? 'Loading areas…' : placeholder}
        options={options}
        xstyle={[styles.control, props.xstyle]}
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
        <Button variant="outline" aria-label="Retry areas" onClick={() => void refetch()}>
          Retry
        </Button>
      )}
    </div>
  );
}

export default AreaSelect;
