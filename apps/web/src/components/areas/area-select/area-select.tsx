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
  includeAllOption = false,
  allOptionLabel = 'All areas',
  allOptionValue = '',
  onValueChange,
  ...props
}: AreaSelectProps) {
  const { data, isPending, isError, refetch } = useAreasQuery();
  const statusId = useId();

  const areasMap = useMemo(() => {
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
