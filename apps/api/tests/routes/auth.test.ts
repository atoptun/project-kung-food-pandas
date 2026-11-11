import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { app } from '@/app';
import prisma from '@/lib/prisma';

import { createAuthUser } from '../helpers/auth';

describe('Auth Endpoints', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /auth/register', () => {
    it('returns 201 and user with token on valid registration', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'Panda',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        token: expect.any(String),
        user: {
          id: expect.any(String),
          name: 'Panda',
          email: 'panda@panda.com',
          avatar: null,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          email: 'panda@panda.com',
        },
      });
      expect(user).not.toBeNull();
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
      const _userData = await createAuthUser({
        name: 'Panda',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      const response = await request(app).post('/auth/register').send({
        name: 'Panda',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User already exists. Use another email.',
      });
    });
  });

  describe('POST /auth/login', () => {
    it('returns 200 and session token on valid credentials', async () => {
      const userData = await createAuthUser({
        name: 'Panda',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      const response = await request(app).post('/auth/login').send({
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: expect.any(String),
        user: {
          id: userData.user.id,
          name: userData.user.name,
          email: userData.user.email,
          avatar: userData.user.image,
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
      const _userData = await createAuthUser({
        name: 'Panda',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

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
      const _userData = await createAuthUser({
        name: 'Panda',
        email: 'panda@panda.com',
        password: 'StrongPass123!',
      });

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', _userData.authHeader);

      expect(response.status).toBe(204);
    });

    it('returns 401 when user is not authenticated', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
    });
  });
});
