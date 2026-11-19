import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '@/app';
import prisma from '@/lib/prisma';
import { FavoritesService } from '@/services/favorites.service';

import { createAuthUser } from '../helpers/auth';
import { addFavorite, createRecipe } from '../helpers/recipes';

const BASE = '/recipes/favorites';
const UNKNOWN_RECIPE_ID = 'cm0000000000000000000none';

async function favoriteAt(userId: string, recipeId: string, createdAt: Date) {
  return prisma.favoriteRecipe.create({ data: { userId, recipeId, createdAt } });
}

describe('Favorites endpoints', () => {
  describe('authorization', () => {
    it.each([
      ['GET', () => request(app).get(BASE)],
      ['POST', () => request(app).post(`${BASE}/any-id`)],
      ['DELETE', () => request(app).delete(`${BASE}/any-id`)],
    ])('%s returns 401 without a session', async (_method, send) => {
      const response = await send();

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ status: 'error', message: 'Not authorized' });
    });

    it('checks the session before validating input', async () => {
      const response = await request(app).get(BASE).query({ limit: 0 });

      expect(response.status).toBe(401);
    });
  });

  describe(`GET ${BASE}`, () => {
    it('returns an empty first page for a user without favorites', async () => {
      const { authHeader } = await createAuthUser();

      const response = await request(app).get(BASE).set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], total: 0, page: 1, limit: 10, totalPages: 0 });
    });

    it('returns only the session user favorites as recipe cards, newest first', async () => {
      const me = await createAuthUser({ name: 'Me' });
      const other = await createAuthUser({ name: 'Author' });
      const older = await createRecipe(other.user.id, { title: 'Older' });
      const newer = await createRecipe(other.user.id, { title: 'Newer' });
      const notMine = await createRecipe(other.user.id, { title: 'Not mine' });

      await favoriteAt(me.user.id, older.id, new Date('2026-01-01T10:00:00Z'));
      await favoriteAt(me.user.id, newer.id, new Date('2026-01-02T10:00:00Z'));
      await addFavorite(other.user.id, older.id);
      await addFavorite(other.user.id, notMine.id);

      const response = await request(app).get(BASE).set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(2);
      expect(response.body.items).toEqual([
        {
          id: newer.id,
          title: 'Newer',
          description: null,
          thumb: null,
          time: null,
          favoritesCount: 1,
          isFavorite: true,
          owner: { id: other.user.id, name: 'Author', avatar: null },
        },
        expect.objectContaining({ id: older.id, favoritesCount: 2, isFavorite: true }),
      ]);
    });

    it('paginates without gaps or overlaps', async () => {
      const me = await createAuthUser();
      const recipes = await Promise.all(
        ['A', 'B', 'C'].map((title) => createRecipe(me.user.id, { title })),
      );
      // The same timestamp checks the stable tie-breaker.
      const sameTime = new Date('2026-01-01T10:00:00Z');
      await Promise.all(recipes.map(({ id }) => favoriteAt(me.user.id, id, sameTime)));

      const page1 = await request(app)
        .get(BASE)
        .query({ page: 1, limit: 2 })
        .set('Authorization', me.authHeader);
      const page2 = await request(app)
        .get(BASE)
        .query({ page: 2, limit: 2 })
        .set('Authorization', me.authHeader);
      const page3 = await request(app)
        .get(BASE)
        .query({ page: 3, limit: 2 })
        .set('Authorization', me.authHeader);

      expect(page1.body).toMatchObject({ total: 3, page: 1, limit: 2, totalPages: 2 });
      expect(page2.body).toMatchObject({ total: 3, page: 2, limit: 2, totalPages: 2 });
      expect(page3.body).toMatchObject({ items: [], total: 3, page: 3 });

      const ids = [...page1.body.items, ...page2.body.items].map(({ id }: { id: string }) => id);
      expect(ids).toHaveLength(3);
      expect(new Set(ids)).toEqual(new Set(recipes.map(({ id }) => id)));
    });

    it.each([{ limit: 0 }, { limit: 101 }, { page: 0 }, { page: 'abc' }])(
      'returns 400 for invalid pagination %o',
      async (query) => {
        const { authHeader } = await createAuthUser();

        const response = await request(app).get(BASE).query(query).set('Authorization', authHeader);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          status: 'error',
          message: 'Invalid query parameters',
        });
      },
    );
  });

  describe(`POST ${BASE}/:id`, () => {
    it('adds the recipe and updates the list and profile statistics', async () => {
      const me = await createAuthUser();
      const recipe = await createRecipe(me.user.id);

      const response = await request(app)
        .post(`${BASE}/${recipe.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Recipe added to favorites successfully' });

      const list = await request(app).get(BASE).set('Authorization', me.authHeader);
      expect(list.body.items).toEqual([
        expect.objectContaining({ id: recipe.id, favoritesCount: 1, isFavorite: true }),
      ]);

      const profile = await request(app).get('/users/me').set('Authorization', me.authHeader);
      expect(profile.body.favoritesCount).toBe(1);
    });

    it('returns 409 for a recipe that is already in favorites', async () => {
      const me = await createAuthUser();
      const recipe = await createRecipe(me.user.id);
      await addFavorite(me.user.id, recipe.id);

      const response = await request(app)
        .post(`${BASE}/${recipe.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Recipe is already in favorites',
      });
      expect(await prisma.favoriteRecipe.count({ where: { userId: me.user.id } })).toBe(1);
    });

    it('keeps a single favorite under concurrent requests', async () => {
      const me = await createAuthUser();
      const recipe = await createRecipe(me.user.id);

      const responses = await Promise.all(
        Array.from({ length: 5 }, () =>
          request(app).post(`${BASE}/${recipe.id}`).set('Authorization', me.authHeader),
        ),
      );

      const statuses = responses.map(({ status }) => status).sort();
      expect(statuses).toEqual([200, 409, 409, 409, 409]);
      expect(await prisma.favoriteRecipe.count({ where: { userId: me.user.id } })).toBe(1);
    });

    it('lets different users favorite the same recipe', async () => {
      const author = await createAuthUser();
      const fan = await createAuthUser();
      const recipe = await createRecipe(author.user.id);

      await request(app).post(`${BASE}/${recipe.id}`).set('Authorization', author.authHeader);
      const response = await request(app)
        .post(`${BASE}/${recipe.id}`)
        .set('Authorization', fan.authHeader);

      expect(response.status).toBe(200);
      const list = await request(app).get(BASE).set('Authorization', fan.authHeader);
      expect(list.body.items[0]).toMatchObject({ id: recipe.id, favoritesCount: 2 });
    });

    it('returns 404 for a recipe that does not exist', async () => {
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .post(`${BASE}/${UNKNOWN_RECIPE_ID}`)
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ status: 'error', message: 'Recipe not found' });
    });

    it('returns 400 for an invalid recipe id', async () => {
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .post(`${BASE}/${'x'.repeat(37)}`)
        .set('Authorization', authHeader);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ status: 'error', message: 'Invalid parameters' });
    });
  });

  describe(`DELETE ${BASE}/:id`, () => {
    it('removes only the session user relation and keeps the recipe', async () => {
      const me = await createAuthUser();
      const other = await createAuthUser();
      const recipe = await createRecipe(other.user.id);
      await addFavorite(me.user.id, recipe.id);
      await addFavorite(other.user.id, recipe.id);

      const response = await request(app)
        .delete(`${BASE}/${recipe.id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Recipe removed from favorites successfully' });
      expect(await prisma.recipe.findUnique({ where: { id: recipe.id } })).not.toBeNull();
      expect(await prisma.favoriteRecipe.findMany({ where: { recipeId: recipe.id } })).toEqual([
        expect.objectContaining({ userId: other.user.id }),
      ]);

      const profile = await request(app).get('/users/me').set('Authorization', me.authHeader);
      expect(profile.body.favoritesCount).toBe(0);
    });

    it.each([
      ['a recipe that is not in favorites', true],
      ['a recipe that does not exist', false],
    ])('returns 404 for %s', async (_case, recipeExists) => {
      const me = await createAuthUser();
      const id = recipeExists ? (await createRecipe(me.user.id)).id : UNKNOWN_RECIPE_ID;

      const response = await request(app)
        .delete(`${BASE}/${id}`)
        .set('Authorization', me.authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Recipe not found or not in favorites',
      });
    });
  });
});

describe('FavoritesService.findFavoriteIds', () => {
  const service = new FavoritesService(prisma);

  it('returns the requested recipes that the user has in favorites', async () => {
    const me = await createAuthUser();
    const [liked, notLiked] = await Promise.all([
      createRecipe(me.user.id, { title: 'Liked' }),
      createRecipe(me.user.id, { title: 'Not liked' }),
    ]);
    await addFavorite(me.user.id, liked.id);

    const ids = await service.findFavoriteIds(me.user.id, [liked.id, notLiked.id]);

    expect(ids).toEqual(new Set([liked.id]));
  });

  it('returns an empty set for a guest or no recipes without querying', async () => {
    expect(await service.findFavoriteIds(undefined, ['any'])).toEqual(new Set());
    expect(await service.findFavoriteIds('user', [])).toEqual(new Set());
  });
});
