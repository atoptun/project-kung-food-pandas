import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';

import { useIngredientsQuery } from '@/api/dictionaries';
import Button from '@/components/shared/button/button';
import Select, { type SelectProps } from '@/components/shared/select/select';
import { typography } from '@/styles/typography.stylex';

import { styles } from './ingredient-select.stylex';

type IngredientSelectProps = Omit<SelectProps, 'options' | 'aria-label'> & {
  'aria-label'?: string;
  excludedIds?: readonly string[];
};

function IngredientSelect({
  disabled,
  placeholder = 'Select an ingredient',
  'aria-label': ariaLabel = 'Ingredient',
  'aria-describedby': describedBy,
  excludedIds = [],
  ...props
}: IngredientSelectProps) {
  const { data, isPending, isError, refetch } = useIngredientsQuery();
  const statusId = useId();
  const options = (data ?? [])
    .filter((item) => !excludedIds.includes(item.id))
    .map((item) => ({
      value: item.id,
      label: item.name,
    }));
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
