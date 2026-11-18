import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';

import { useCategoriesQuery } from '@/api/dictionaries';
import Button from '@/components/shared/button/button';
import Select, { type SelectProps } from '@/components/shared/select/select';
import { typography } from '@/styles/typography.stylex';

import { styles } from './category-select.stylex';

type CategorySelectProps = Omit<SelectProps, 'options' | 'aria-label'> & {
  'aria-label'?: string;
};

function CategorySelect({
  disabled,
  placeholder = 'Select a category',
  'aria-label': ariaLabel = 'Category',
  'aria-describedby': describedBy,
  ...props
}: CategorySelectProps) {
  const { data, isPending, isError, refetch } = useCategoriesQuery();
  const statusId = useId();
  const options = (data ?? []).map((item) => ({
    value: item.id,
    label: item.name,
  }));
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
