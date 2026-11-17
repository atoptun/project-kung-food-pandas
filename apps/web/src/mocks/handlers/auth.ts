import { http, HttpResponse } from 'msw';

export type MockAuthUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type MockAccount = MockAuthUser & { password: string };

const DEFAULT_ACCOUNT: MockAccount = {
  id: 'mock-user-1',
  name: 'Victoria',
  email: 'victoria@foodies.com',
  image: null,
  password: 'StrongPass123!',
};

const accounts = new Map<string, MockAccount>([[DEFAULT_ACCOUNT.email, DEFAULT_ACCOUNT]]);
let currentUser: MockAuthUser | null = null;

function toPublicUser({ password: _password, ...user }: MockAccount): MockAuthUser {
  return user;
}

function sessionPayload(user: MockAuthUser) {
  const now = new Date();
  return {
    session: {
      id: `mock-session-${user.id}`,
      userId: user.id,
      token: `mock-token-${user.id}`,
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    user: {
      ...user,
      emailVerified: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  };
}

/** Test/dev helper: sets the user returned by `GET /api/auth/get-session`. */
export function setMockSessionUser(user: MockAuthUser | null) {
  currentUser = user;
}

/** Test/dev helper: restores the default mock account and signs it out. */
export function resetMockAuth() {
  accounts.clear();
  accounts.set(DEFAULT_ACCOUNT.email, DEFAULT_ACCOUNT);
  currentUser = null;
}

export const mockAuthAccount = toPublicUser(DEFAULT_ACCOUNT);
export const mockAuthPassword = DEFAULT_ACCOUNT.password;

export const authHandlers = [
  http.get('*/api/auth/get-session', () => {
    return HttpResponse.json(currentUser ? sessionPayload(currentUser) : null);
  }),

  http.post('*/api/auth/sign-in/email', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    const account = accounts.get(email);

    if (!account || account.password !== password) {
      return HttpResponse.json(
        { code: 'INVALID_EMAIL_OR_PASSWORD', message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    currentUser = toPublicUser(account);
    return HttpResponse.json({
      redirect: false,
      token: `mock-token-${account.id}`,
      user: currentUser,
    });
  }),

  http.post('*/api/auth/sign-up/email', async ({ request }) => {
    const { name, email, password } = (await request.json()) as {
      name: string;
      email: string;
      password: string;
    };

    if (accounts.has(email)) {
      return HttpResponse.json(
        {
          code: 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
          message: 'User already exists. Use another email.',
        },
        { status: 422 },
      );
    }

    const account: MockAccount = {
      id: `mock-user-${accounts.size + 1}`,
      name,
      email,
      password,
      image: null,
    };
    accounts.set(email, account);
    currentUser = toPublicUser(account);

    return HttpResponse.json({ token: `mock-token-${account.id}`, user: currentUser });
  }),

  http.post('*/api/auth/sign-out', () => {
    currentUser = null;
    return HttpResponse.json({ success: true });
  }),
];
