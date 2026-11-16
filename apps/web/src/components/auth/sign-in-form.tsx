import type { LoginInput } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';

import Button from '@/components/shared/button/button';
import { signIn } from '@/lib/auth-client';
import { typography } from '@/styles/typography.stylex';

import { signInSchema } from './auth.validation';
import { styles } from './auth-form.stylex';
import FormField from './form-field';
import { useAuthForm } from './use-auth-form';

type SignInFormProps = {
  titleId: string;
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
};

const initialValues: LoginInput = { email: '', password: '' };

function SignInForm({ titleId, onSuccess, onSwitchToSignUp }: SignInFormProps) {
  const { formik, apiError, handleChange, fieldError } = useAuthForm({
    initialValues,
    validationSchema: signInSchema,
    submit: (values) => signIn.email(values),
    onSuccess,
  });

  return (
    <>
      <h2 id={titleId} {...stylex.props(styles.title)}>
        Sign in
      </h2>

      <form {...stylex.props(styles.form)} noValidate onSubmit={formik.handleSubmit}>
        <div {...stylex.props(styles.fields)}>
          <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email*"
            value={formik.values.email}
            onChange={handleChange}
            error={fieldError('email')}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={formik.values.password}
            onChange={handleChange}
            error={fieldError('password')}
          />
        </div>

        {apiError && (
          <p role="alert" {...stylex.props(typography.mainBold, styles.apiError)}>
            {apiError}
          </p>
        )}

        <Button type="submit" fullWidth disabled={formik.isSubmitting}>
          Sign in
        </Button>
      </form>

      <p {...stylex.props(styles.switchText)}>
        Don&apos;t have an account?{' '}
        <button type="button" {...stylex.props(styles.switchButton)} onClick={onSwitchToSignUp}>
          Create an account
        </button>
      </p>
    </>
  );
}

export default SignInForm;
