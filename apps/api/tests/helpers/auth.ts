import { auth } from '@/lib/auth';

export async function createAuthUser(
  overrides: Partial<{
    name: string;
    email: string;
    password: string;
  }> = {},
) {
  const email =
    overrides.email ?? `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@example.com`;
  const name = overrides.name ?? 'Test User';
  const password = overrides.password ?? 'StrongPass123!';

  const result = await auth.api.signUpEmail({
    body: { email, name, password },
  });

  return {
    user: result.user,
    token: result.token,
    authHeader: `Bearer ${result.token}`,
    password,
  };
}
