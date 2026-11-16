import type { RegisterInput } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';

import Button from '@/components/shared/button/button';
import { signUp } from '@/lib/auth-client';
import { typography } from '@/styles/typography.stylex';

import { signUpSchema } from './auth.validation';
import { styles } from './auth-form.stylex';
import FormField from './form-field';
import { useAuthForm } from './use-auth-form';

type SignUpFormProps = {
  titleId: string;
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
};

const initialValues: RegisterInput = { name: '', email: '', password: '' };

function SignUpForm({ titleId, onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const { formik, apiError, handleChange, fieldError } = useAuthForm({
    initialValues,
    validationSchema: signUpSchema,
    submit: (values) => signUp.email(values),
    onSuccess,
  });

  return (
    <>
      <h2 id={titleId} {...stylex.props(styles.title)}>
        Sign up
      </h2>

      <form {...stylex.props(styles.form)} noValidate onSubmit={formik.handleSubmit}>
        <div {...stylex.props(styles.fields)}>
          <FormField
            label="Name"
            name="name"
            autoComplete="name"
            placeholder="Name*"
            value={formik.values.name}
            onChange={handleChange}
            error={fieldError('name')}
          />
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
            autoComplete="new-password"
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
          Create
        </Button>
      </form>

      <p {...stylex.props(styles.switchText)}>
        Already have an account?{' '}
        <button type="button" {...stylex.props(styles.switchButton)} onClick={onSwitchToSignIn}>
          Sign in
        </button>
      </p>
    </>
  );
}

export default SignUpForm;
