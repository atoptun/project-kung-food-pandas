import { existsSync } from 'node:fs';

import type { UploadApiResponse } from 'cloudinary';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { app } from '@/app';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';

import { createAuthUser } from '../helpers/auth';
import { addFavorite, createRecipe } from '../helpers/recipes';

const AVATAR_URL = 'https://res.cloudinary.com/test_cloud/image/upload/avatars/avatar.png';
const PNG_BUFFER = Buffer.from('89504e470d0a1a0a', 'hex');

function mockCloudinaryUpload() {
  return vi
    .spyOn(cloudinary.uploader, 'upload')
    .mockResolvedValue({ secure_url: AVATAR_URL } as UploadApiResponse);
}

describe('Users Endpoints', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /users/me', () => {
    it('returns 200 with current user profile and zero statistics for a new user', async () => {
      const { user, authHeader } = await createAuthUser({
        name: 'Panda',
        email: 'panda@panda.com',
      });

      const response = await request(app).get('/users/me').set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          id: user.id,
          name: 'Panda',
          email: 'panda@panda.com',
          avatar: null,
        },
        recipesCount: 0,
        favoritesCount: 0,
        followersCount: 0,
        followingCount: 0,
      });
    });

    it('returns counters that match own recipes and favorites in the database', async () => {
      const me = await createAuthUser();
      const other = await createAuthUser();

      const myRecipe = await createRecipe(me.user.id, { title: 'My recipe 1' });
      await createRecipe(me.user.id, { title: 'My recipe 2' });
      const otherRecipe = await createRecipe(other.user.id, { title: 'Other recipe' });

      await addFavorite(me.user.id, otherRecipe.id);
      await addFavorite(other.user.id, myRecipe.id);

      const response = await request(app).get('/users/me').set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        recipesCount: 2,
        favoritesCount: 1,
      });
    });

    it('returns 401 when user is not authenticated', async () => {
      const response = await request(app).get('/users/me');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
    });
  });

  describe('GET /users/:id', () => {
    it('returns 200 with profile of another user and its statistics', async () => {
      const me = await createAuthUser();
      const other = await createAuthUser({ name: 'Other Panda', email: 'other@panda.com' });

      const otherRecipe = await createRecipe(other.user.id);
      await createRecipe(other.user.id);
      await createRecipe(me.user.id);
      await addFavorite(other.user.id, otherRecipe.id);

      const response = await request(app)
        .get(`/users/${other.user.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          id: other.user.id,
          name: 'Other Panda',
          email: 'other@panda.com',
          avatar: null,
        },
        recipesCount: 2,
        followersCount: 0,
      });
    });

    it('returns 404 when user does not exist', async () => {
      const me = await createAuthUser();

      const response = await request(app)
        .get('/users/nonexistent-user-id')
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User not found',
      });
    });

    it('returns 400 when id parameter is invalid', async () => {
      const me = await createAuthUser();

      const response = await request(app)
        .get(`/users/${'a'.repeat(37)}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid parameters',
        issues: expect.any(Array),
      });
    });

    it('returns 401 when user is not authenticated', async () => {
      const other = await createAuthUser();

      const response = await request(app).get(`/users/${other.user.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
    });
  });

  describe('PATCH /users/me/avatar', () => {
    it('returns 200 with updated profile and stores the uploaded avatar url', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { user, authHeader } = await createAuthUser({ email: 'panda@panda.com' });

      const response = await request(app)
        .patch('/users/me/avatar')
        .set('Authorization', authHeader)
        .attach('avatar', PNG_BUFFER, { filename: 'avatar.png', contentType: 'image/png' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          id: user.id,
          name: user.name,
          email: 'panda@panda.com',
          avatar: AVATAR_URL,
        },
        recipesCount: 0,
        favoritesCount: 0,
        followersCount: 0,
        followingCount: 0,
      });

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(dbUser?.avatar).toBe(AVATAR_URL);

      expect(uploadSpy).toHaveBeenCalledTimes(1);
      const tmpFilePath = uploadSpy.mock.lastCall?.[0];
      expect(tmpFilePath).toEqual(expect.any(String));
      expect(existsSync(tmpFilePath as string)).toBe(false);
    });

    it.each([
      ['jpeg', 'avatar.jpg', 'image/jpeg'],
      ['webp', 'avatar.webp', 'image/webp'],
    ])('accepts %s images', async (_type, filename, contentType) => {
      mockCloudinaryUpload();
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .patch('/users/me/avatar')
        .set('Authorization', authHeader)
        .attach('avatar', PNG_BUFFER, { filename, contentType });

      expect(response.status).toBe(200);
      expect(response.body.user.avatar).toBe(AVATAR_URL);
    });

    it('returns 422 when avatar file is missing', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .patch('/users/me/avatar')
        .set('Authorization', authHeader);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Validation failed',
        issues: [{ path: 'avatar', message: 'Avatar file is required' }],
      });
      expect(uploadSpy).not.toHaveBeenCalled();
    });

    it('returns 400 when file type is not allowed', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .patch('/users/me/avatar')
        .set('Authorization', authHeader)
        .attach('avatar', Buffer.from('plain text'), {
          filename: 'avatar.txt',
          contentType: 'text/plain',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Only jpeg, png and webp allowed',
      });
      expect(uploadSpy).not.toHaveBeenCalled();
    });

    it('returns 400 when file size exceeds 5 MB', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .patch('/users/me/avatar')
        .set('Authorization', authHeader)
        .attach('avatar', Buffer.alloc(5 * 1024 * 1024 + 1), {
          filename: 'avatar.png',
          contentType: 'image/png',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'File size exceeds the 5 MB limit',
      });
      expect(uploadSpy).not.toHaveBeenCalled();
    });

    it('returns 400 when file is sent under an unexpected field name', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .patch('/users/me/avatar')
        .set('Authorization', authHeader)
        .attach('photo', PNG_BUFFER, { filename: 'avatar.png', contentType: 'image/png' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Unexpected file field',
      });
      expect(uploadSpy).not.toHaveBeenCalled();
    });

    it('returns 500, keeps old avatar and removes temp file when upload to storage fails', async () => {
      const uploadSpy = vi
        .spyOn(cloudinary.uploader, 'upload')
        .mockRejectedValue(new Error('Cloudinary is down'));
      const { user, authHeader } = await createAuthUser();

      const response = await request(app)
        .patch('/users/me/avatar')
        .set('Authorization', authHeader)
        .attach('avatar', PNG_BUFFER, { filename: 'avatar.png', contentType: 'image/png' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Internal server error',
      });

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(dbUser?.avatar).toBeNull();

      const tmpFilePath = uploadSpy.mock.lastCall?.[0];
      expect(tmpFilePath).toEqual(expect.any(String));
      expect(existsSync(tmpFilePath as string)).toBe(false);
    });

    it('returns 401 when user is not authenticated', async () => {
      const uploadSpy = mockCloudinaryUpload();

      const response = await request(app)
        .patch('/users/me/avatar')
        .attach('avatar', PNG_BUFFER, { filename: 'avatar.png', contentType: 'image/png' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
      expect(uploadSpy).not.toHaveBeenCalled();
    });
  });
});
