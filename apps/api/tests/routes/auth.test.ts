import { APIError } from 'better-auth/api';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { app } from '@/app';
import { auth } from '@/lib/auth';

describe('Auth Endpoints', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /auth/register', () => {
    it('returns 201 and user with token on valid registration', async () => {
      vi.spyOn(auth.api, 'signUpEmail').mockResolvedValueOnce({
        token: 'mock-session-token',
        user: {
          id: 'user-1',
          name: 'Panda',
          email: 'panda@panda.com',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const response = await request(app).post('/auth/register').send({
        name: 'Panda',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        token: 'mock-session-token',
        user: {
          name: 'Panda',
          email: 'panda@panda.com',
        },
      });
    });

    it('returns 422 when request body fails validation', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'P',
        email: 'invalid-email',
        password: '123',
      });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Validation failed',
        issues: expect.any(Array),
      });
    });

    it('returns error status when user already exists', async () => {
      vi.spyOn(auth.api, 'signUpEmail').mockRejectedValueOnce(
        new APIError('UNPROCESSABLE_ENTITY', {
          message: 'User already exists',
        }),
      );

      const response = await request(app).post('/auth/register').send({
        name: 'Panda',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User already exists',
      });
    });
  });

  describe('POST /auth/login', () => {
    it('returns 200 and session token on valid credentials', async () => {
      vi.spyOn(auth.api, 'signInEmail').mockResolvedValueOnce({
        redirect: false,
        token: 'mock-login-token',
        user: {
          id: 'user-1',
          name: 'Panda',
          email: 'panda@panda.com',
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const response = await request(app).post('/auth/login').send({
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: 'mock-login-token',
        user: {
          name: 'Panda',
          email: 'panda@panda.com',
        },
      });
    });

    it('returns 422 when login payload is invalid', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'not-an-email',
        password: '123',
      });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Validation failed',
        issues: expect.any(Array),
      });
    });

    it('returns 401 when credentials are invalid', async () => {
      vi.spyOn(auth.api, 'signInEmail').mockRejectedValueOnce(
        new APIError('UNAUTHORIZED', {
          message: 'Invalid email or password',
        }),
      );

      const response = await request(app).post('/auth/login').send({
        email: 'panda@panda.com',
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid email or password',
      });
    });
  });

  describe('POST /auth/logout', () => {
    it('returns 204 when authenticated user logs out', async () => {
      const now = new Date();
      vi.spyOn(auth.api, 'getSession').mockResolvedValueOnce({
        session: {
          id: 'session-1',
          token: 'valid-token',
          userId: 'user-1',
          expiresAt: new Date(now.getTime() + 86400000),
          createdAt: now,
          updatedAt: now,
        },
        user: {
          id: 'user-1',
          name: 'Panda',
          email: 'panda@panda.com',
          emailVerified: false,
          createdAt: now,
          updatedAt: now,
        },
      });
      vi.spyOn(auth.api, 'signOut').mockResolvedValueOnce({
        success: true,
        url: undefined,
        redirect: undefined,
      });

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
    });

    it('returns 401 when user is not authenticated', async () => {
      vi.spyOn(auth.api, 'getSession').mockResolvedValueOnce(null);

      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
    });
  });
});
