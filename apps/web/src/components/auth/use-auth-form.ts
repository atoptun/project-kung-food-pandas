import { type FormikValues, useFormik } from 'formik';
import { type ChangeEvent, useState } from 'react';
import type * as yup from 'yup';

import { getErrorMessage } from '@/utils/error-message';

type AuthResult = { error?: { message?: string } | null } | null | undefined;

type UseAuthFormOptions<T extends FormikValues> = {
  initialValues: T;
  validationSchema: yup.ObjectSchema<T>;
  submit: (values: T) => Promise<AuthResult>;
  onSuccess: () => void;
};

/**
 * Formik form for Better Auth actions: validates on submit only,
 * clears a field error while the user edits it and exposes the API error.
 */
export function useAuthForm<T extends FormikValues>({
  initialValues,
  validationSchema,
  submit,
  onSuccess,
}: UseAuthFormOptions<T>) {
  const [apiError, setApiError] = useState<string | null>(null);

  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (rawValues) => {
      setApiError(null);
      const values = validationSchema.cast(rawValues) as T;

      try {
        const result = await submit(values);
        if (result?.error) {
          setApiError(getErrorMessage(result.error));
          return;
        }
        onSuccess();
      } catch (error) {
        setApiError(getErrorMessage(error));
      }
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event);
    formik.setFieldError(event.target.name, undefined);
  };

  const fieldError = (name: keyof T & string) => {
    const error = formik.errors[name];
    return formik.submitCount > 0 && typeof error === 'string' ? error : undefined;
  };

  return { formik, apiError, handleChange, fieldError };
}
