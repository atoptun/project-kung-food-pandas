import * as stylex from '@stylexjs/stylex';
import { type ComponentPropsWithRef, useId } from 'react';

import Input from '@/components/shared/input/input';
import { typography } from '@/styles/typography.stylex';

import { styles } from './auth-form.stylex';

type FormFieldProps = Omit<ComponentPropsWithRef<typeof Input>, 'id'> & {
  label: string;
  error?: string;
};

/** Input with a screen-reader label and an accessible validation message. */
function FormField({ label, error, ...props }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div {...stylex.props(styles.field)}>
      <label htmlFor={id} {...stylex.props(styles.visuallyHidden)}>
        {label}
      </label>
      <Input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        xstyle={error ? styles.invalid : undefined}
      />
      {error && (
        <p id={errorId} {...stylex.props(typography.caption, styles.error)}>
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
