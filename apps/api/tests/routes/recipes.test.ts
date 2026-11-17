import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import {
  RecipeDetailsSchema,
  RecipesListResponseSchema,
  UserRecipesListResponseSchema,
} from '@repo/shared';
import type { UploadApiResponse } from 'cloudinary';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { app } from '@/app';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';

import { createAuthUser } from '../helpers/auth';
import { addFavorite, createRecipe } from '../helpers/recipes';

const image = Buffer.from('89504e470d0a1a0a', 'hex');
const thumb = 'https://res.cloudinary.com/test_cloud/image/upload/recipes/test.png';

async function setup() {
  const owner = await createAuthUser();
  const recipe = await createRecipe(owner.user.id);
  const ingredient = await prisma.ingredient.create({ data: { name: null } });
  await prisma.recipeIngredient.create({
    data: { recipeId: recipe.id, ingredientId: ingredient.id, measure: '200g' },
  });
  return {
    owner,
    recipe,
    ingredient,
    input: {
      title: 'New recipe',
      description: 'Description',
      instructions: 'Cook for ten minutes.',
      categoryId: recipe.categoryId,
      areaId: recipe.areaId,
      time: '10',
      ingredients: JSON.stringify([{ id: ingredient.id, measure: '200g' }]),
    },
  };
}

function uploadMock() {
  return vi
    .spyOn(cloudinary.uploader, 'upload')
    .mockResolvedValue({ secure_url: thumb, public_id: 'recipes/test' } as UploadApiResponse);
}

describe('Recipes endpoints (real PostgreSQL, storage boundary stubbed)', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    await prisma.recipeIngredient.deleteMany();
    await prisma.ingredient.deleteMany();
  });

  it('combines all filters and paginates deterministically, including empty and very large pages', async () => {
    const { owner, recipe, ingredient } = await setup();
    await createRecipe(owner.user.id);
    const query = {
      category: recipe.categoryId,
      area: recipe.areaId,
      ingredient: ingredient.id,
      limit: 1,
    };
    const first = await request(app).get('/recipes').query(query);
    expect(first.status).toBe(200);
    expect(RecipesListResponseSchema.parse(first.body)).toMatchObject({
      total: 1,
      page: 1,
      limit: 1,
      totalPages: 1,
      items: [{ id: recipe.id }],
    });
    for (const overrides of [
      { page: 2 },
      { page: 2147483648 },
      { category: 'missing' },
      { area: 'missing' },
      { ingredient: 'missing' },
    ]) {
      const result = await request(app)
        .get('/recipes')
        .query({ ...query, ...overrides });
      expect(result.status).toBe(200);
      expect(result.body.items).toEqual([]);
    }
    const page1 = await request(app).get('/recipes').query({ limit: 1 });
    const page2 = await request(app).get('/recipes').query({ limit: 1, page: 2 });
    expect(page1.body.total).toBe(2);
    expect(page1.body.items[0].id).not.toBe(page2.body.items[0].id);
    expect((await request(app).get('/recipes?page=0')).status).toBe(400);
    expect((await request(app).get('/recipes?limit=101')).status).toBe(400);
  });

  it('returns details without private author fields and ranks popular recipes by favorites', async () => {
    const { owner, recipe, ingredient } = await setup();
    const popular = await createRecipe(owner.user.id);
    await addFavorite(owner.user.id, popular.id);
    const details = await request(app).get(`/recipes/${recipe.id}`);
    expect(details.status).toBe(200);
    expect(RecipeDetailsSchema.parse(details.body)).toMatchObject({
      owner: { id: owner.user.id },
      ingredients: [{ id: ingredient.id, name: null, measure: '200g' }],
    });
    expect(details.body.owner).not.toHaveProperty('email');
    const result = await request(app).get('/recipes/popular?limit=1');
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject([{ id: popular.id, favoritesCount: 1 }]);
    expect((await request(app).get('/recipes/popular?limit=0')).status).toBe(400);
    expect((await request(app).get('/recipes/missing')).status).toBe(404);
  });

  it('protects private endpoints and restricts own/author lists to the selected owner', async () => {
    const { owner, recipe } = await setup();
    const other = await createAuthUser();
    await createRecipe(other.user.id);
    for (const path of ['/recipes/own', `/users/${owner.user.id}/recipes`]) {
      expect((await request(app).get(path)).status).toBe(401);
      const result = await request(app).get(path).set('Authorization', owner.authHeader);
      expect(result.status).toBe(200);
      expect(result.body).toMatchObject({ total: 1, items: [{ id: recipe.id }] });
      if (path.startsWith('/users')) UserRecipesListResponseSchema.parse(result.body);
    }
    expect(
      (await request(app).get('/users/missing/recipes').set('Authorization', owner.authHeader))
        .status,
    ).toBe(404);
    expect((await request(app).post('/recipes')).status).toBe(401);
    expect((await request(app).delete(`/recipes/${recipe.id}`)).status).toBe(401);
    expect(
      (await request(app).delete(`/recipes/${recipe.id}`).set('Authorization', other.authHeader))
        .status,
    ).toBe(403);
    expect(await prisma.recipe.findUnique({ where: { id: recipe.id } })).not.toBeNull();
    await addFavorite(other.user.id, recipe.id);
    expect(
      (await request(app).delete(`/recipes/${recipe.id}`).set('Authorization', owner.authHeader))
        .status,
    ).toBe(200);
    expect(await prisma.recipeIngredient.count({ where: { recipeId: recipe.id } })).toBe(0);
    expect(await prisma.favoriteRecipe.count({ where: { recipeId: recipe.id } })).toBe(0);
    expect(
      (await request(app).delete(`/recipes/${recipe.id}`).set('Authorization', owner.authHeader))
        .status,
    ).toBe(404);
  });

  it('creates a multipart recipe and its ingredient relation, then removes the temporary image', async () => {
    const { owner, input } = await setup();
    const upload = uploadMock();
    const result = await request(app)
      .post('/recipes')
      .set('Authorization', owner.authHeader)
      .field(input)
      .attach('thumb', image, { filename: 'recipe.png', contentType: 'image/png' });
    expect(result.status).toBe(201);
    expect(RecipeDetailsSchema.parse(result.body)).toMatchObject({
      title: input.title,
      thumb,
      time: 10,
      owner: { id: owner.user.id },
      ingredients: [{ measure: '200g' }],
    });
    expect(await prisma.recipeIngredient.count({ where: { recipeId: result.body.id } })).toBe(1);
    await vi.waitFor(() => expect(existsSync(upload.mock.calls[0]![0] as string)).toBe(false));
  });

  it('rejects missing files, malformed/duplicate ingredients and unknown references before storage upload', async () => {
    const { owner, input } = await setup();
    const upload = uploadMock();
    expect(
      (await request(app).post('/recipes').set('Authorization', owner.authHeader).send(input))
        .status,
    ).toBe(422);
    const directory = resolve(tmpdir(), 'kung-food-pandas-uploads');
    const before = await readdir(directory);
    for (const overrides of [
      { ingredients: 'broken' },
      { ingredients: '[]' },
      {
        ingredients: JSON.stringify([
          { id: 'same', measure: '1g' },
          { id: 'same', measure: '2g' },
        ]),
      },
      { categoryId: 'missing' },
      { areaId: 'missing' },
      { ingredients: '[{"id":"missing","measure":"1g"}]' },
    ]) {
      const result = await request(app)
        .post('/recipes')
        .set('Authorization', owner.authHeader)
        .field({ ...input, ...overrides })
        .attach('thumb', image, { filename: 'invalid.png', contentType: 'image/png' });
      expect(result.status).toBe(422);
    }
    expect(upload).not.toHaveBeenCalled();
    expect(await prisma.recipe.count()).toBe(1);
    await vi.waitFor(async () => expect(await readdir(directory)).toEqual(before));
  });

  it('enforces upload type and size limits', async () => {
    const { owner, input } = await setup();
    for (const [body, contentType] of [
      [Buffer.from('text'), 'text/plain'],
      [Buffer.alloc(5 * 1024 * 1024 + 1), 'image/png'],
    ] as const) {
      const result = await request(app)
        .post('/recipes')
        .set('Authorization', owner.authHeader)
        .field(input)
        .attach('thumb', body, { filename: 'recipe.png', contentType });
      expect(result.status).toBe(400);
    }
    expect(await prisma.recipe.count()).toBe(1);
  });

  it('keeps the database unchanged and removes the temp image when storage fails', async () => {
    const { owner, input } = await setup();
    const upload = vi
      .spyOn(cloudinary.uploader, 'upload')
      .mockRejectedValue(new Error('Storage unavailable'));
    const result = await request(app)
      .post('/recipes')
      .set('Authorization', owner.authHeader)
      .field(input)
      .attach('thumb', image, { filename: 'recipe.png', contentType: 'image/png' });
    expect(result.status).toBe(500);
    expect(await prisma.recipe.count()).toBe(1);
    await vi.waitFor(() => expect(existsSync(upload.mock.calls[0]![0] as string)).toBe(false));
  });
});
