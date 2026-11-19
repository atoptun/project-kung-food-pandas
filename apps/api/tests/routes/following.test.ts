import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '@/app';
import prisma from '@/lib/prisma';

import { createAuthUser } from '../helpers/auth';
import { createRecipe } from '../helpers/recipes';

describe('User Following & Followers Endpoints', () => {
  describe('POST /users/me/following/:id', () => {
    it('returns 201 when following another user', async () => {
      const me = await createAuthUser({ email: 'follower@panda.com' });
      const target = await createAuthUser({ email: 'target@panda.com' });

      const response = await request(app)
        .post(`/users/me/following/${target.user.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Successfully followed the user.',
      });

      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: me.user.id,
            followingId: target.user.id,
          },
        },
      });
      expect(follow).not.toBeNull();
    });

    it('returns 400 when attempting to follow oneself', async () => {
      const me = await createAuthUser();

      const response = await request(app)
        .post(`/users/me/following/${me.user.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Cannot follow yourself',
      });
    });

    it('returns 404 when target user does not exist', async () => {
      const me = await createAuthUser();

      const response = await request(app)
        .post('/users/me/following/nonexistent-user-id')
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User not found',
      });
    });

    it('returns 409 when already following the user', async () => {
      const me = await createAuthUser({ email: 'follower2@panda.com' });
      const target = await createAuthUser({ email: 'target2@panda.com' });

      await prisma.follow.create({
        data: { followerId: me.user.id, followingId: target.user.id },
      });

      const response = await request(app)
        .post(`/users/me/following/${target.user.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Already following this user',
      });
    });

    it('returns 401 when not authenticated', async () => {
      const target = await createAuthUser();

      const response = await request(app).post(`/users/me/following/${target.user.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
    });
  });

  describe('DELETE /users/me/following/:id', () => {
    it('returns 204 when unfollowing a user', async () => {
      const me = await createAuthUser({ email: 'unfollower@panda.com' });
      const target = await createAuthUser({ email: 'unfollowed@panda.com' });

      await prisma.follow.create({
        data: { followerId: me.user.id, followingId: target.user.id },
      });

      const response = await request(app)
        .delete(`/users/me/following/${target.user.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: me.user.id,
            followingId: target.user.id,
          },
        },
      });
      expect(follow).toBeNull();
    });

    it('returns 404 when unfollowing user that is not currently followed', async () => {
      const me = await createAuthUser();
      const target = await createAuthUser();

      const response = await request(app)
        .delete(`/users/me/following/${target.user.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User not found or not currently followed',
      });
    });

    it('returns 401 when not authenticated', async () => {
      const target = await createAuthUser();

      const response = await request(app).delete(`/users/me/following/${target.user.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /users/me/following', () => {
    it('returns 200 with paginated list of followed users, recipesCount, topRecipes, and isFollowing=true', async () => {
      const me = await createAuthUser({ email: 'cur_user@panda.com' });
      const target1 = await createAuthUser({ name: 'Target One', email: 't1@panda.com' });
      const target2 = await createAuthUser({ name: 'Target Two', email: 't2@panda.com' });

      await createRecipe(target1.user.id, { title: 'R1' });
      await createRecipe(target1.user.id, { title: 'R2' });

      await prisma.follow.createMany({
        data: [
          { followerId: me.user.id, followingId: target1.user.id },
          { followerId: me.user.id, followingId: target2.user.id },
        ],
      });

      const response = await request(app)
        .get('/users/me/following')
        .query({ page: 1, limit: 10 })
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(response.body.items).toHaveLength(2);

      const item1 = response.body.items.find(
        (i: { user: { id: string } }) => i.user.id === target1.user.id,
      );
      expect(item1).toBeDefined();
      expect(item1.recipesCount).toBe(2);
      expect(item1.topRecipes).toHaveLength(2);
      expect(item1.isFollowing).toBe(true);

      const item2 = response.body.items.find(
        (i: { user: { id: string } }) => i.user.id === target2.user.id,
      );
      expect(item2).toBeDefined();
      expect(item2.recipesCount).toBe(0);
      expect(item2.topRecipes).toEqual([]);
      expect(item2.isFollowing).toBe(true);
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(app).get('/users/me/following');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /users/:id/followers', () => {
    it('returns 200 with list of followers and computes isFollowing correctly for current user', async () => {
      const me = await createAuthUser({ name: 'Me', email: 'me_follower@panda.com' });
      const target = await createAuthUser({ name: 'Target Creator', email: 'creator@panda.com' });
      const third = await createAuthUser({ name: 'Third User', email: 'third@panda.com' });

      // third follows target
      await prisma.follow.create({
        data: { followerId: third.user.id, followingId: target.user.id },
      });

      // me also follows third
      await prisma.follow.create({
        data: { followerId: me.user.id, followingId: third.user.id },
      });

      const response = await request(app)
        .get(`/users/${target.user.id}/followers`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.items).toHaveLength(1);

      const followerItem = response.body.items[0];
      expect(followerItem.user.id).toBe(third.user.id);
      expect(followerItem.isFollowing).toBe(true);
    });

    it('returns isFollowing=false when current user is not following the follower', async () => {
      const me = await createAuthUser({ name: 'Me', email: 'me_unconnected@panda.com' });
      const target = await createAuthUser({ name: 'Target Creator', email: 'creator2@panda.com' });
      const third = await createAuthUser({ name: 'Third User', email: 'third2@panda.com' });

      // third follows target, but me does not follow third
      await prisma.follow.create({
        data: { followerId: third.user.id, followingId: target.user.id },
      });

      const response = await request(app)
        .get(`/users/${target.user.id}/followers`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body.items[0].isFollowing).toBe(false);
    });

    it('returns 404 when target user does not exist', async () => {
      const me = await createAuthUser();

      const response = await request(app)
        .get('/users/nonexistent-user-id/followers')
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User not found',
      });
    });

    it('returns 401 when not authenticated', async () => {
      const target = await createAuthUser();

      const response = await request(app).get(`/users/${target.user.id}/followers`);

      expect(response.status).toBe(401);
    });
  });

  describe('Integration with User Profiles', () => {
    it('updates followersCount and followingCount correctly after follow and unfollow', async () => {
      const me = await createAuthUser({ email: 'p_me@panda.com' });
      const target = await createAuthUser({ email: 'p_target@panda.com' });

      // Initial stats
      let meProfile = await request(app).get('/users/me').set('Authorization', me.authHeader);
      let targetProfile = await request(app)
        .get(`/users/${target.user.id}`)
        .set('Authorization', me.authHeader);

      expect(meProfile.body.followingCount).toBe(0);
      expect(targetProfile.body.followersCount).toBe(0);
      expect(targetProfile.body.isFollowing).toBe(false);

      // Follow target
      await request(app)
        .post(`/users/me/following/${target.user.id}`)
        .set('Authorization', me.authHeader);

      meProfile = await request(app).get('/users/me').set('Authorization', me.authHeader);
      targetProfile = await request(app)
        .get(`/users/${target.user.id}`)
        .set('Authorization', me.authHeader);

      expect(meProfile.body.followingCount).toBe(1);
      expect(targetProfile.body.followersCount).toBe(1);
      expect(targetProfile.body.isFollowing).toBe(true);

      // Unfollow target
      await request(app)
        .delete(`/users/me/following/${target.user.id}`)
        .set('Authorization', me.authHeader);

      meProfile = await request(app).get('/users/me').set('Authorization', me.authHeader);
      targetProfile = await request(app)
        .get(`/users/${target.user.id}`)
        .set('Authorization', me.authHeader);

      expect(meProfile.body.followingCount).toBe(0);
      expect(targetProfile.body.followersCount).toBe(0);
      expect(targetProfile.body.isFollowing).toBe(false);
    });
  });
});
