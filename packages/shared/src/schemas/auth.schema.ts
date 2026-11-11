import { z } from '../zod';

export const RegisterSchema = z
  .object({
    email: z.email().openapi({ example: 'panda@panda.com' }),
    name: z.string().min(2).max(50).openapi({ example: 'Panda' }),
    password: z.string().min(8).max(72).openapi({ example: 'StrongPass123!' }),
  })
  .openapi('RegisterRequest');

export const LoginSchema = z
  .object({
    email: z.email().openapi({ example: 'panda@panda.com' }),
    password: z.string().min(8).max(72).openapi({ example: 'StrongPass123!' }),
  })
  .openapi('LoginRequest');

export const AuthUserSchema = z
  .object({
    id: z.string().max(32).openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d1' }),
    email: z.email().openapi({ example: 'panda@panda.com' }),
    name: z.string().openapi({ example: 'Panda' }),
    avatar: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: 'https://res.cloudinary.com/.../avatar.jpg' }),
  })
  .openapi('AuthUser');

export const AuthResponseSchema = z
  .object({
    token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    user: AuthUserSchema,
  })
  .openapi('AuthResponse');

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
