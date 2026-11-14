import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '@/app';
import prisma from '@/lib/prisma';

import { createAuthUser } from '../helpers/auth';

async function createRecipe(ownerId: string, title: string) {
  const category = await prisma.category.upsert({
    where: { name: 'Follow test category' },
    update: {},
    create: { name: 'Follow test category' },
  });
  const area = await prisma.area.upsert({
    where: { name: 'Follow test area' },
    update: {},
    create: { name: 'Follow test area' },
  });

  return prisma.recipe.create({
    data: { title, ownerId, categoryId: category.id, areaId: area.id, thumb: 'recipe.jpg' },
  });
}

describe('User follow endpoints', () => {
  it('requires authentication for follower lists', async () => {
    const response = await request(app).get('/users/me/following');

    expect(response.status).toBe(401);
  });

  it('follows once, rejects duplicate and self follows, and returns followed user recipes', async () => {
    const follower = await createAuthUser();
    const followed = await createAuthUser();
    await createRecipe(followed.user.id, 'Panda noodles');

    const followedResponse = await request(app)
      .post(`/users/me/following/${followed.user.id}`)
      .set('Authorization', follower.authHeader);
    const duplicateResponse = await request(app)
      .post(`/users/me/following/${followed.user.id}`)
      .set('Authorization', follower.authHeader);
    const selfResponse = await request(app)
      .post(`/users/me/following/${follower.user.id}`)
      .set('Authorization', follower.authHeader);
    const missingResponse = await request(app)
      .post('/users/me/following/missing-user')
      .set('Authorization', follower.authHeader);
    const listResponse = await request(app)
      .get('/users/me/following')
      .set('Authorization', follower.authHeader);

    expect(followedResponse.status).toBe(201);
    expect(duplicateResponse.status).toBe(409);
    expect(selfResponse.status).toBe(400);
    expect(missingResponse.status).toBe(404);
    expect(listResponse.status).toBe(200);
    expect(listResponse.headers['x-total-count']).toBe('1');
    expect(listResponse.body).toMatchObject({
      users: [{
        id: followed.user.id,
        name: followed.user.name,
        recipes: [{ title: 'Panda noodles' }],
      }],
      pagination: { page: 1, limit: 10, totalCount: 1, totalPages: 1 },
    });
    expect(
      await prisma.userFollow.count({ where: { followerId: follower.user.id } }),
    ).toBe(listResponse.body.pagination.totalCount);
    expect(await prisma.userFollow.count({ where: { followingId: followed.user.id } })).toBe(1);
    expect(await prisma.userFollow.count()).toBe(1);
  });

  it('unfollows and reports a repeated unfollow without leaving duplicate relations', async () => {
    const follower = await createAuthUser();
    const followed = await createAuthUser();

    await request(app)
      .post(`/users/me/following/${followed.user.id}`)
      .set('Authorization', follower.authHeader);

    const unfollowResponse = await request(app)
      .delete(`/users/me/following/${followed.user.id}`)
      .set('Authorization', follower.authHeader);
    const repeatedResponse = await request(app)
      .delete(`/users/me/following/${followed.user.id}`)
      .set('Authorization', follower.authHeader);

    expect(unfollowResponse.status).toBe(204);
    expect(repeatedResponse.status).toBe(404);
    expect(await prisma.userFollow.count()).toBe(0);
  });

  it('paginates private followers, returns their recipes, and rejects missing users', async () => {
    const target = await createAuthUser();
    const firstFollower = await createAuthUser();
    const secondFollower = await createAuthUser();
    await createRecipe(firstFollower.user.id, 'First follower recipe');

    for (const follower of [firstFollower, secondFollower]) {
      await request(app)
        .post(`/users/me/following/${target.user.id}`)
        .set('Authorization', follower.authHeader);
    }

    const response = await request(app)
      .get(`/users/${target.user.id}/followers?page=2&limit=1`)
      .set('Authorization', target.authHeader);
    const allFollowersResponse = await request(app)
      .get(`/users/${target.user.id}/followers?limit=2`)
      .set('Authorization', target.authHeader);
    const invalidPageResponse = await request(app)
      .get(`/users/${target.user.id}/followers?page=0`)
      .set('Authorization', target.authHeader);
    const missingResponse = await request(app)
      .get('/users/missing-user/followers')
      .set('Authorization', target.authHeader);

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(1);
    expect(response.body.pagination).toMatchObject({ page: 2, limit: 1, totalCount: 2, totalPages: 2 });
    expect(response.headers['x-total-count']).toBe('2');
    expect(allFollowersResponse.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstFollower.user.id,
          recipes: [expect.objectContaining({ title: 'First follower recipe' })],
        }),
        expect.objectContaining({ id: secondFollower.user.id, recipes: [] }),
      ]),
    );
    expect(invalidPageResponse.status).toBe(400);
    expect(missingResponse.status).toBe(404);
  });
});