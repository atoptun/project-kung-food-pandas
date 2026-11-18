import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';

import { useAreasQuery } from '@/api/dictionaries';
import Button from '@/components/shared/button/button';
import Select, { type SelectProps } from '@/components/shared/select/select';
import { typography } from '@/styles/typography.stylex';

import { styles } from './area-select.stylex';

type AreaSelectProps = Omit<SelectProps, 'options' | 'aria-label'> & {
  'aria-label'?: string;
};

function AreaSelect({
  disabled,
  placeholder = 'Select an area',
  'aria-label': ariaLabel = 'Area',
  'aria-describedby': describedBy,
  ...props
}: AreaSelectProps) {
  const { data, isPending, isError, refetch } = useAreasQuery();
  const statusId = useId();
  const options = (data ?? []).map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const failed = data === undefined && isError;
  const loading = data === undefined && isPending;
  const empty = data !== undefined && options.length === 0;
  const status = failed ? 'Unable to load areas.' : empty ? 'No areas available.' : undefined;

  return (
    <div {...stylex.props(styles.field)}>
      <Select
        {...props}
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
