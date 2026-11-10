import { describe, expect, it } from 'vitest';

import { AuthResponseSchema, LoginSchema, RegisterSchema } from '../../src/index';

describe('Auth Schemas', () => {
  describe('RegisterSchema', () => {
    it('validates a valid registration payload', () => {
      const parsed = RegisterSchema.safeParse({
        name: 'Panda Chef',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      expect(parsed.success).toBe(true);
    });

    it('rejects invalid email or short password', () => {
      const parsed = RegisterSchema.safeParse({
        name: 'P',
        email: 'not-an-email',
        password: 'short',
      });

      expect(parsed.success).toBe(false);
    });
  });

  describe('LoginSchema', () => {
    it('validates a valid login payload', () => {
      const parsed = LoginSchema.safeParse({
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      expect(parsed.success).toBe(true);
    });

    it('rejects missing or invalid fields', () => {
      const parsed = LoginSchema.safeParse({
        email: 'invalid-email',
        password: '123',
      });

      expect(parsed.success).toBe(false);
    });
  });

  describe('AuthResponseSchema', () => {
    it('validates a valid auth response payload', () => {
      const parsed = AuthResponseSchema.safeParse({
        token: 'sample-session-token',
        user: {
          name: 'Panda Chef',
          email: 'panda@panda.com',
        },
      });

      expect(parsed.success).toBe(true);
    });
  });
});
