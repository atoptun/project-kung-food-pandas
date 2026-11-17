import type { LoginInput, RegisterInput } from '@repo/shared';
import * as yup from 'yup';

// Mirrors LoginSchema / RegisterSchema constraints from @repo/shared.
const email = yup.string().trim().required('Email is required').email('Enter a valid email');

const password = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters');

export const signInSchema: yup.ObjectSchema<LoginInput> = yup.object({
  email,
  password,
});

export const signUpSchema: yup.ObjectSchema<RegisterInput> = yup.object({
  name: yup
    .string()
    .trim()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email,
  password,
});
