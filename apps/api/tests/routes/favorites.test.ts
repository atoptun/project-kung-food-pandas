import {
  ApiErrorResponseSchema,
  RecipeActionResponseSchema,
  RecipesListResponseSchema,
} from '@repo/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '@/app';
import prisma from '@/lib/prisma';

import { createAuthUser } from '../helpers/auth';
import { addFavorite, createRecipe } from '../helpers/recipes';

describe('Favorite recipes endpoints (real PostgreSQL and authentication)', () => {
  it('requires a valid session on every endpoint before validating input', async () => {
    for (const header of [undefined, 'Bearer invalid-token']) {
      for (const [method, path] of [
        ['get', '/recipes/favorites?page=0'],
        ['post', `/recipes/favorites/${'a'.repeat(37)}`],
        ['delete', `/recipes/favorites/${'a'.repeat(37)}`],
      ] as const) {
        const pending = request(app)[method](path);
        if (header) pending.set('Authorization', header);
        const response = await pending;
        expect(response.status).toBe(401);
        expect(ApiErrorResponseSchema.parse(response.body)).toMatchObject({ status: 'error' });
      }
    }
  });

  it('returns an empty list with default pagination, ahead of the recipe ID route', async () => {
    const me = await createAuthUser();
    const response = await request(app)
      .get('/recipes/favorites')
      .set('Authorization', me.authHeader);
    expect(response.status).toBe(200);
    expect(RecipesListResponseSchema.parse(response.body)).toEqual({
      items: [],
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 10,
    });
  });

  it('rejects invalid pagination and IDs through the shared validation middleware', async () => {
    const me = await createAuthUser();
    for (const query of [
      { page: 0 },
      { page: 1.5 },
      { page: 'invalid' },
      { limit: 0 },
      { limit: 101 },
    ]) {
      const response = await request(app)
        .get('/recipes/favorites')
        .set('Authorization', me.authHeader)
        .query(query);
      expect(response.status).toBe(400);
      expect(ApiErrorResponseSchema.parse(response.body)).toMatchObject({
        message: 'Invalid query parameters',
        issues: expect.any(Array),
      });
    }
    for (const method of ['post', 'delete'] as const) {
      const response = await request(app)
        [method](`/recipes/favorites/${'a'.repeat(37)}`)
        .set('Authorization', me.authHeader);
      expect(response.status).toBe(400);
      expect(ApiErrorResponseSchema.parse(response.body)).toMatchObject({
        message: 'Invalid parameters',
        issues: expect.any(Array),
      });
    }
    expect(await prisma.favoriteRecipe.count()).toBe(0);
  });

  it('paginates only session user favorites with stable ordering and safe recipe cards', async () => {
    const me = await createAuthUser();
    const other = await createAuthUser();
    const first = await createRecipe(other.user.id);
    const second = await createRecipe(me.user.id);
    const excluded = await createRecipe(other.user.id);
    await addFavorite(me.user.id, second.id);
    await addFavorite(me.user.id, first.id);
    await addFavorite(other.user.id, excluded.id);
    const orderedIds = [first.id, second.id].sort();
    for (const page of [1, 2, 3, 2147483649]) {
      const response = await request(app)
        .get('/recipes/favorites')
        .set('Authorization', me.authHeader)
        .query({ page, limit: 1, userId: other.user.id });
      expect(response.status).toBe(200);
      const result = RecipesListResponseSchema.parse(response.body);
      expect(result).toMatchObject({ total: 2, totalPages: 2, page, limit: 1 });
      expect(result.items.map(({ id }) => id)).toEqual(page <= 2 ? [orderedIds[page - 1]] : []);
      if (page <= 2) {
        expect(result.items[0]).toMatchObject({
          favoritesCount: 1,
          owner: { id: expect.any(String) },
        });
        expect(response.body.items[0].owner).not.toHaveProperty('email');
        expect(response.body.items[0]).not.toHaveProperty('_count');
      }
    }
  });

  it('uses shared validation for IDs and pagination without mutating favorites', async () => {
    const me = await createAuthUser();
    for (const query of [
      'page=0',
      'page=1.5',
      'page=no',
      'limit=0',
      'limit=101',
      'limit=1&limit=2',
    ]) {
      const response = await request(app)
        .get(`/recipes/favorites?${query}`)
        .set('Authorization', me.authHeader);
      expect(response.status).toBe(400);
      expect(ApiErrorResponseSchema.parse(response.body).issues?.length).toBeGreaterThan(0);
    }
    for (const method of ['post', 'delete'] as const) {
      const response = await request(app)
        [method](`/recipes/favorites/${'a'.repeat(37)}`)
        .set('Authorization', me.authHeader);
      expect(response.status).toBe(400);
      expect(ApiErrorResponseSchema.parse(response.body).issues).toContainEqual({
        path: 'id',
        message: expect.any(String),
      });
    }
    expect(await prisma.favoriteRecipe.count()).toBe(0);
  });

  it('adds for the session user, rejects duplicates, and allows another user to favorite the same recipe', async () => {
    const me = await createAuthUser();
    const other = await createAuthUser();
    const recipe = await createRecipe(other.user.id);
    const path = `/recipes/favorites/${recipe.id}`;
    const added = await request(app)
      .post(path)
      .set('Authorization', me.authHeader)
      .send({ userId: other.user.id });
    expect(added.status).toBe(200);
    expect(RecipeActionResponseSchema.parse(added.body)).toEqual({
      message: 'Recipe added to favorites successfully',
    });
    expect(await prisma.favoriteRecipe.findMany()).toMatchObject([
      { userId: me.user.id, recipeId: recipe.id },
    ]);
    const duplicate = await request(app).post(path).set('Authorization', me.authHeader);
    expect(duplicate.status).toBe(409);
    expect(ApiErrorResponseSchema.parse(duplicate.body)).toMatchObject({
      message: 'Recipe is already in favorites',
    });
    expect(
      (
        await request(app)
          .post(path)
          .set('Authorization', other.authHeader)
          .send({ userId: me.user.id })
      ).status,
    ).toBe(200);
    expect(await prisma.favoriteRecipe.count({ where: { recipeId: recipe.id } })).toBe(2);
  });

  it('returns 404 for missing recipes and absent favorite relations', async () => {
    const me = await createAuthUser();
    const recipe = await createRecipe(me.user.id);
    for (const [method, id] of [
      ['post', 'missing'],
      ['delete', 'missing'],
      ['delete', recipe.id],
    ] as const) {
      const response = await request(app)
        [method](`/recipes/favorites/${id}`)
        .set('Authorization', me.authHeader);
      expect(response.status).toBe(404);
      expect(ApiErrorResponseSchema.parse(response.body)).toMatchObject({ status: 'error' });
    }
    expect(await prisma.favoriteRecipe.count()).toBe(0);
    expect(await prisma.recipe.count()).toBe(1);
  });

  it('removes only the session user relation and leaves the recipe and other favorites intact', async () => {
    const me = await createAuthUser();
    const other = await createAuthUser();
    const recipe = await createRecipe(other.user.id);
    const path = `/recipes/favorites/${recipe.id}`;
    await addFavorite(other.user.id, recipe.id);
    expect(
      (
        await request(app)
          .delete(path)
          .set('Authorization', me.authHeader)
          .send({ userId: other.user.id })
      ).status,
    ).toBe(404);
    expect(await prisma.favoriteRecipe.count()).toBe(1);
    await addFavorite(me.user.id, recipe.id);
    const removed = await request(app).delete(path).set('Authorization', me.authHeader);
    expect(removed.status).toBe(200);
    expect(RecipeActionResponseSchema.parse(removed.body)).toEqual({
      message: 'Recipe removed from favorites successfully',
    });
    expect((await request(app).delete(path).set('Authorization', me.authHeader)).status).toBe(404);
    expect(await prisma.favoriteRecipe.findMany()).toMatchObject([
      { userId: other.user.id, recipeId: recipe.id },
    ]);
    expect(await prisma.recipe.findUnique({ where: { id: recipe.id } })).not.toBeNull();
    expect((await request(app).post(path).set('Authorization', me.authHeader)).status).toBe(200);
  });

  it('handles concurrent adds and removals without duplicates or server errors', async () => {
    const me = await createAuthUser();
    const recipe = await createRecipe(me.user.id);
    const path = `/recipes/favorites/${recipe.id}`;
    const adds = await Promise.all(
      [1, 2].map(() => request(app).post(path).set('Authorization', me.authHeader)),
    );
    expect(adds.map(({ status }) => status).sort()).toEqual([200, 409]);
    expect(await prisma.favoriteRecipe.count()).toBe(1);
    const removals = await Promise.all(
      [1, 2].map(() => request(app).delete(path).set('Authorization', me.authHeader)),
    );
    expect(removals.map(({ status }) => status).sort()).toEqual([200, 404]);
    expect(await prisma.favoriteRecipe.count()).toBe(0);
    expect(await prisma.recipe.count()).toBe(1);
  });

  it('keeps profile statistics, list totals, details and popularity consistent after API mutations', async () => {
    const me = await createAuthUser();
    const other = await createAuthUser();
    const recipe = await createRecipe(other.user.id);
    const competitor = await createRecipe(other.user.id);
    await addFavorite(other.user.id, competitor.id);
    const path = `/recipes/favorites/${recipe.id}`;
    for (const user of [me, other]) {
      expect((await request(app).post(path).set('Authorization', user.authHeader)).status).toBe(
        200,
      );
    }
    const popular = await request(app).get('/recipes/popular?limit=1');
    expect(popular.status).toBe(200);
    expect(popular.body).toMatchObject([{ id: recipe.id, favoritesCount: 2 }]);
    for (const [method, count, recipeCount] of [
      ['get', 1, 2],
      ['delete', 0, 1],
    ] as const) {
      if (method === 'delete')
        expect((await request(app).delete(path).set('Authorization', me.authHeader)).status).toBe(
          200,
        );
      const profile = await request(app).get('/users/me').set('Authorization', me.authHeader);
      const favorites = await request(app)
        .get('/recipes/favorites')
        .set('Authorization', me.authHeader);
      const details = await request(app).get(`/recipes/${recipe.id}`);
      expect(profile.status).toBe(200);
      expect(favorites.status).toBe(200);
      expect(details.status).toBe(200);
      expect(profile.body.favoritesCount).toBe(count);
      expect(favorites.body.total).toBe(count);
      expect(favorites.body.items).toHaveLength(count);
      expect(details.body.favoritesCount).toBe(recipeCount);
      const ranking = await request(app).get('/recipes/popular');
      expect(ranking.body.find(({ id }: { id: string }) => id === recipe.id).favoritesCount).toBe(
        recipeCount,
      );
    }
  });
});
