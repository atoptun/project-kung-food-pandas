import type { UploadApiResponse } from 'cloudinary';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { app } from '@/app';
import * as cloudinaryLib from '@/lib/cloudinary';
import prisma from '@/lib/prisma';

import { createAuthUser } from '../helpers/auth';
import {
  addFavorite,
  createArea,
  createCategory,
  createIngredient,
  createRecipe,
} from '../helpers/recipes';

const THUMB_URL = 'https://res.cloudinary.com/test_cloud/image/upload/recipes/soup.png';
const THUMB_ID = 'recipes/soup';
const PNG_BUFFER = Buffer.from('89504e470d0a1a0a', 'hex');
const INSTRUCTIONS = 'Boil water, cook pasta, and stir in the sauce.';

function mockCloudinaryUpload() {
  return vi
    .spyOn(cloudinaryLib, 'uploadFromBuffer')
    .mockResolvedValue({ secure_url: THUMB_URL, public_id: THUMB_ID } as UploadApiResponse);
}

function mockCloudinaryDelete() {
  return vi.spyOn(cloudinaryLib, 'deleteFromCloudinary').mockResolvedValue();
}

async function recipePayload(
  overrides: Partial<{
    title: string;
    description: string;
    instructions: string;
    categoryId: string;
    areaId: string;
    time: number;
    ingredients: { id: string; measure: string }[];
  }> = {},
) {
  const category = overrides.categoryId ? null : await createCategory();
  const area = overrides.areaId ? null : await createArea();
  const ingredient = overrides.ingredients ? null : await createIngredient('Tomato');

  return {
    title: overrides.title ?? 'Tomato Pasta',
    description: overrides.description ?? 'A simple weeknight pasta',
    instructions: overrides.instructions ?? INSTRUCTIONS,
    categoryId: overrides.categoryId ?? category!.id,
    areaId: overrides.areaId ?? area!.id,
    time: overrides.time ?? 25,
    ingredients: overrides.ingredients ?? [{ id: ingredient!.id, measure: '200g' }],
  };
}

describe('Recipes Endpoints', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /recipes', () => {
    it('returns a paginated list ordered by title and omits isFavorite for a guest', async () => {
      const author = await createAuthUser({ name: 'Author' });
      const later = await createRecipe(author.user.id, { title: 'Zucchini Soup', time: 15 });
      const earlier = await createRecipe(author.user.id, {
        title: 'Apple Pie',
        description: 'Sweet pie',
        time: 40,
      });

      const response = await request(app).get('/recipes').query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 2,
        page: 1,
        totalPages: 1,
        limit: 10,
        items: [
          {
            id: earlier.id,
            title: 'Apple Pie',
            thumb: null,
            description: 'Sweet pie',
            time: 40,
            favoritesCount: 0,
            owner: { id: author.user.id, name: 'Author', avatar: null },
          },
          {
            id: later.id,
            title: 'Zucchini Soup',
            thumb: null,
            description: null,
            time: 15,
            favoritesCount: 0,
            owner: { id: author.user.id, name: 'Author', avatar: null },
          },
        ],
      });
    });

    it('paginates results on the server', async () => {
      const author = await createAuthUser();
      await createRecipe(author.user.id, { title: 'A' });
      await createRecipe(author.user.id, { title: 'B' });
      await createRecipe(author.user.id, { title: 'C' });

      const response = await request(app).get('/recipes').query({ page: 2, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        total: 3,
        page: 2,
        totalPages: 2,
        limit: 2,
      });
      expect(response.body.items).toEqual([expect.objectContaining({ title: 'C' })]);
    });

    it('filters by category, area, and ingredient together', async () => {
      const author = await createAuthUser();
      const italian = await createCategory('Italian');
      const french = await createCategory('French');
      const europe = await createArea('European');
      const asia = await createArea('Asian');
      const pasta = await createIngredient('Pasta');
      const rice = await createIngredient('Rice');

      const match = await createRecipe(author.user.id, {
        title: 'Match',
        categoryId: italian.id,
        areaId: europe.id,
        ingredients: [{ ingredientId: pasta.id, measure: '100g' }],
      });
      await createRecipe(author.user.id, {
        title: 'Wrong category',
        categoryId: french.id,
        areaId: europe.id,
        ingredients: [{ ingredientId: pasta.id, measure: '100g' }],
      });
      await createRecipe(author.user.id, {
        title: 'Wrong area',
        categoryId: italian.id,
        areaId: asia.id,
        ingredients: [{ ingredientId: pasta.id, measure: '100g' }],
      });
      await createRecipe(author.user.id, {
        title: 'Wrong ingredient',
        categoryId: italian.id,
        areaId: europe.id,
        ingredients: [{ ingredientId: rice.id, measure: '100g' }],
      });

      const response = await request(app).get('/recipes').query({
        category: italian.id,
        area: europe.id,
        ingredient: pasta.id,
      });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.items).toEqual([
        expect.objectContaining({ id: match.id, title: 'Match' }),
      ]);
    });

    it('returns an empty page when filters match nothing', async () => {
      const author = await createAuthUser();
      await createRecipe(author.user.id, { title: 'Something' });

      const response = await request(app)
        .get('/recipes')
        .query({ category: 'missing-category-id' });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ total: 0, items: [] });
    });

    it('sets isFavorite for the authenticated viewer', async () => {
      const author = await createAuthUser({ name: 'Author' });
      const viewer = await createAuthUser({ name: 'Viewer' });
      const favorite = await createRecipe(author.user.id, { title: 'Favorite' });
      const other = await createRecipe(author.user.id, { title: 'Other' });
      await addFavorite(viewer.user.id, favorite.id);
      await addFavorite(author.user.id, other.id);

      const response = await request(app).get('/recipes').set('Authorization', viewer.authHeader);

      expect(response.status).toBe(200);
      expect(response.body.items).toEqual([
        expect.objectContaining({ id: favorite.id, isFavorite: true, favoritesCount: 1 }),
        expect.objectContaining({ id: other.id, isFavorite: false, favoritesCount: 1 }),
      ]);
    });

    it('returns 400 when query parameters are invalid', async () => {
      const response = await request(app).get('/recipes').query({ page: 0, limit: 200 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid query parameters',
        issues: expect.any(Array),
      });
    });
  });

  describe('GET /recipes/popular', () => {
    it('returns recipes ordered by favorites count and defaults the limit to 4', async () => {
      const author = await createAuthUser();
      const fanA = await createAuthUser();
      const fanB = await createAuthUser();
      const popular = await createRecipe(author.user.id, { title: 'Popular' });
      const medium = await createRecipe(author.user.id, { title: 'Medium' });
      await createRecipe(author.user.id, { title: 'Quiet 1' });
      await createRecipe(author.user.id, { title: 'Quiet 2' });
      await createRecipe(author.user.id, { title: 'Quiet 3' });

      await addFavorite(fanA.user.id, popular.id);
      await addFavorite(fanB.user.id, popular.id);
      await addFavorite(fanA.user.id, medium.id);

      const response = await request(app).get('/recipes/popular');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(4);
      expect(response.body[0]).toEqual(
        expect.objectContaining({ id: popular.id, favoritesCount: 2 }),
      );
      expect(response.body[1]).toEqual(
        expect.objectContaining({ id: medium.id, favoritesCount: 1 }),
      );
      expect(response.body[0].isFavorite).toBeUndefined();
    });

    it('respects a custom limit and includes isFavorite for an authenticated viewer', async () => {
      const author = await createAuthUser();
      const viewer = await createAuthUser();
      const first = await createRecipe(author.user.id, { title: 'First' });
      const second = await createRecipe(author.user.id, { title: 'Second' });
      await addFavorite(viewer.user.id, second.id);

      const response = await request(app)
        .get('/recipes/popular')
        .query({ limit: 1 })
        .set('Authorization', viewer.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({ id: second.id, isFavorite: true, favoritesCount: 1 }),
      ]);
      expect(response.body.map((item: { id: string }) => item.id)).not.toContain(first.id);
    });

    it('returns 400 when limit is out of range', async () => {
      const response = await request(app).get('/recipes/popular').query({ limit: 0 });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Invalid query parameters',
      });
    });
  });

  describe('GET /recipes/:id', () => {
    it('returns recipe details with category, area, owner, and ingredients', async () => {
      const author = await createAuthUser({ name: 'Chef' });
      const category = await createCategory('Dessert');
      const area = await createArea('British');
      const pear = await createIngredient('Pear');
      const apple = await createIngredient('Apple');
      const recipe = await createRecipe(author.user.id, {
        title: 'Fruit Crumble',
        description: 'Warm fruit dessert',
        instructions: 'Slice the fruit and bake until golden.',
        time: 50,
        categoryId: category.id,
        areaId: area.id,
        ingredients: [
          { ingredientId: pear.id, measure: '2 pcs' },
          { ingredientId: apple.id, measure: '1 pcs' },
        ],
      });
      await addFavorite(author.user.id, recipe.id);

      const response = await request(app).get(`/recipes/${recipe.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: recipe.id,
        title: 'Fruit Crumble',
        thumb: null,
        description: 'Warm fruit dessert',
        time: 50,
        favoritesCount: 1,
        instructions: 'Slice the fruit and bake until golden.',
        category: { id: category.id, name: 'Dessert' },
        area: { id: area.id, name: 'British' },
        owner: { id: author.user.id, name: 'Chef', avatar: null },
        ingredients: expect.arrayContaining([
          {
            id: pear.id,
            name: 'Pear',
            description: 'Pear description',
            img: null,
            measure: '2 pcs',
          },
          {
            id: apple.id,
            name: 'Apple',
            description: 'Apple description',
            img: null,
            measure: '1 pcs',
          },
        ]),
      });
      expect(response.body.ingredients).toHaveLength(2);
      expect(response.body.isFavorite).toBeUndefined();
    });

    it('returns isFavorite for the authenticated viewer', async () => {
      const author = await createAuthUser();
      const viewer = await createAuthUser();
      const recipe = await createRecipe(author.user.id, { title: 'Saved' });
      await addFavorite(viewer.user.id, recipe.id);

      const response = await request(app)
        .get(`/recipes/${recipe.id}`)
        .set('Authorization', viewer.authHeader);

      expect(response.status).toBe(200);
      expect(response.body.isFavorite).toBe(true);
    });

    it('returns 404 when the recipe does not exist', async () => {
      const response = await request(app).get('/recipes/missing-recipe-id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Recipe not found',
      });
    });

    it('returns 400 when the id parameter is invalid', async () => {
      const response = await request(app).get(`/recipes/${'a'.repeat(37)}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid parameters',
        issues: expect.any(Array),
      });
    });
  });

  describe('GET /recipes/own', () => {
    it('returns only recipes created by the current user', async () => {
      const me = await createAuthUser({ name: 'Me' });
      const other = await createAuthUser({ name: 'Other' });
      const mine = await createRecipe(me.user.id, { title: 'Mine', description: 'Own dish' });
      await createRecipe(other.user.id, { title: 'Theirs' });
      await addFavorite(me.user.id, mine.id);

      const response = await request(app).get('/recipes/own').set('Authorization', me.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10,
        items: [
          {
            id: mine.id,
            title: 'Mine',
            thumb: null,
            description: 'Own dish',
            time: null,
            favoritesCount: 1,
            isFavorite: true,
            owner: { id: me.user.id, name: 'Me', avatar: null },
          },
        ],
      });
    });

    it('returns 401 when the user is not authenticated', async () => {
      const response = await request(app).get('/recipes/own');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
    });
  });

  describe('GET /users/:id/recipes', () => {
    it('returns short cards of the selected author', async () => {
      const viewer = await createAuthUser();
      const author = await createAuthUser({ name: 'Author' });
      const recipe = await createRecipe(author.user.id, {
        title: 'Author Soup',
        description: 'Their soup',
        thumb: THUMB_URL,
      });
      await createRecipe(viewer.user.id, { title: 'My soup' });

      const response = await request(app)
        .get(`/users/${author.user.id}/recipes`)
        .set('Authorization', viewer.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10,
        items: [
          {
            id: recipe.id,
            title: 'Author Soup',
            thumb: THUMB_URL,
            description: 'Their soup',
          },
        ],
      });
    });

    it('returns an empty page when the user has no recipes', async () => {
      const viewer = await createAuthUser();
      const author = await createAuthUser();

      const response = await request(app)
        .get(`/users/${author.user.id}/recipes`)
        .set('Authorization', viewer.authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10,
        items: [],
      });
    });

    it('returns 404 when the user does not exist', async () => {
      const viewer = await createAuthUser();

      const response = await request(app)
        .get('/users/missing-user-id/recipes')
        .set('Authorization', viewer.authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User not found',
      });
    });

    it('returns 400 when the id parameter is invalid', async () => {
      const viewer = await createAuthUser();

      const response = await request(app)
        .get(`/users/${'a'.repeat(37)}/recipes`)
        .set('Authorization', viewer.authHeader);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Invalid parameters',
      });
    });

    it('returns 401 when the user is not authenticated', async () => {
      const author = await createAuthUser();

      const response = await request(app).get(`/users/${author.user.id}/recipes`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
    });
  });

  describe('POST /recipes', () => {
    it('creates a recipe from JSON without a photo', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { user, authHeader } = await createAuthUser({ name: 'Chef' });
      const payload = await recipePayload();

      const response = await request(app)
        .post('/recipes')
        .set('Authorization', authHeader)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: payload.title,
        description: payload.description,
        instructions: payload.instructions,
        time: payload.time,
        thumb: null,
        favoritesCount: 0,
        isFavorite: false,
        category: { id: payload.categoryId },
        area: { id: payload.areaId },
        owner: { id: user.id, name: 'Chef', avatar: null },
        ingredients: [expect.objectContaining({ id: payload.ingredients[0]?.id, measure: '200g' })],
      });
      expect(uploadSpy).not.toHaveBeenCalled();

      const saved = await prisma.recipe.findUnique({
        where: { id: response.body.id },
        include: { ingredients: true },
      });
      expect(saved?.ownerId).toBe(user.id);
      expect(saved?.ingredients).toEqual([
        expect.objectContaining({
          ingredientId: payload.ingredients[0]?.id,
          measure: '200g',
        }),
      ]);
    });

    it('creates a recipe with a photo from multipart form data', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { authHeader } = await createAuthUser();
      const category = await createCategory('Soup');
      const area = await createArea('Ukrainian');
      const ingredient = await createIngredient('Beet');

      const response = await request(app)
        .post('/recipes')
        .set('Authorization', authHeader)
        .field('title', 'Borscht')
        .field('description', 'Warm beet soup')
        .field('instructions', INSTRUCTIONS)
        .field('categoryId', category.id)
        .field('areaId', area.id)
        .field('time', '90')
        .field('ingredients', JSON.stringify([{ id: ingredient.id, measure: '2 pcs' }]))
        .attach('thumb', PNG_BUFFER, { filename: 'borscht.png', contentType: 'image/png' });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: 'Borscht',
        time: 90,
        thumb: THUMB_URL,
        ingredients: [expect.objectContaining({ id: ingredient.id, measure: '2 pcs' })],
      });

      expect(uploadSpy).toHaveBeenCalledTimes(1);
      expect(uploadSpy).toHaveBeenCalledWith(
        PNG_BUFFER,
        expect.objectContaining({ folder: expect.any(String) }),
      );

      const saved = await prisma.recipe.findUnique({ where: { id: response.body.id } });
      expect(saved?.thumb).toBe(THUMB_URL);
    });

    it('accepts a recipe without description, time, or ingredients', async () => {
      const { authHeader } = await createAuthUser();
      const category = await createCategory();
      const area = await createArea();

      const response = await request(app).post('/recipes').set('Authorization', authHeader).send({
        title: 'Plain Bread',
        instructions: INSTRUCTIONS,
        categoryId: category.id,
        areaId: area.id,
        ingredients: [],
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: 'Plain Bread',
        description: null,
        time: null,
        thumb: null,
        ingredients: [],
      });
    });

    it('returns 422 when the body does not match the contract', async () => {
      const { authHeader } = await createAuthUser();
      const category = await createCategory();
      const area = await createArea();

      const response = await request(app)
        .post('/recipes')
        .set('Authorization', authHeader)
        .send({
          title: 'A',
          instructions: 'too short',
          categoryId: category.id,
          areaId: area.id,
          time: 0,
          ingredients: [{ id: 'salt', measure: '' }],
        });

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation failed',
      });
      expect(response.body.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: 'title' }),
          expect.objectContaining({ path: 'instructions' }),
          expect.objectContaining({ path: 'time' }),
          expect.objectContaining({ path: 'ingredients.0.measure' }),
        ]),
      );
      expect(await prisma.recipe.count()).toBe(0);
    });

    it('returns 422 when multipart ingredients are invalid JSON', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .post('/recipes')
        .set('Authorization', authHeader)
        .field('title', 'Borscht')
        .field('instructions', INSTRUCTIONS)
        .field('categoryId', 'category')
        .field('areaId', 'area')
        .field('ingredients', '{not-json')
        .attach('thumb', PNG_BUFFER, { filename: 'borscht.png', contentType: 'image/png' });

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation failed',
      });
      expect(response.body.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: 'ingredients' })]),
      );
      expect(uploadSpy).not.toHaveBeenCalled();
    });

    it('returns 422 when ingredient ids are duplicated', async () => {
      const { authHeader } = await createAuthUser();
      const ingredient = await createIngredient('Salt');
      const payload = await recipePayload({
        ingredients: [
          { id: ingredient.id, measure: '1 tsp' },
          { id: ingredient.id, measure: '2 tsp' },
        ],
      });

      const response = await request(app)
        .post('/recipes')
        .set('Authorization', authHeader)
        .send(payload);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Validation failed',
        issues: [{ path: 'ingredients', message: 'Ingredient ids must be unique' }],
      });
    });

    it('returns 400 when category, area, or ingredient does not exist', async () => {
      const { authHeader } = await createAuthUser();
      const payload = await recipePayload({
        categoryId: 'missing-category',
        areaId: 'missing-area',
        ingredients: [{ id: 'missing-ingredient', measure: '1 tsp' }],
      });

      const response = await request(app)
        .post('/recipes')
        .set('Authorization', authHeader)
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid input data',
        issues: [
          { path: 'categoryId', message: 'Category not found' },
          { path: 'areaId', message: 'Area not found' },
          { path: 'ingredients', message: 'Ingredient not found' },
        ],
      });
      expect(await prisma.recipe.count()).toBe(0);
    });

    it('returns 400 when the image type is not allowed', async () => {
      const uploadSpy = mockCloudinaryUpload();
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .post('/recipes')
        .set('Authorization', authHeader)
        .attach('thumb', Buffer.from('plain text'), {
          filename: 'notes.txt',
          contentType: 'text/plain',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Only jpeg, png and webp allowed',
      });
      expect(uploadSpy).not.toHaveBeenCalled();
    });

    it('creates a recipe without a photo when storage upload fails', async () => {
      const uploadSpy = vi
        .spyOn(cloudinaryLib, 'uploadFromBuffer')
        .mockRejectedValue(new Error('Cloudinary is down'));
      const { authHeader } = await createAuthUser();
      const payload = await recipePayload();

      const response = await request(app)
        .post('/recipes')
        .set('Authorization', authHeader)
        .field('title', payload.title)
        .field('description', payload.description)
        .field('instructions', payload.instructions)
        .field('categoryId', payload.categoryId)
        .field('areaId', payload.areaId)
        .field('time', String(payload.time))
        .field('ingredients', JSON.stringify(payload.ingredients))
        .attach('thumb', PNG_BUFFER, { filename: 'soup.png', contentType: 'image/png' });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: payload.title,
        thumb: null,
      });
      expect(uploadSpy).toHaveBeenCalledTimes(1);

      const saved = await prisma.recipe.findUnique({ where: { id: response.body.id } });
      expect(saved?.thumb).toBeNull();
    });

    it('returns 401 when the user is not authenticated', async () => {
      const payload = await recipePayload();

      const response = await request(app).post('/recipes').send(payload);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
      expect(await prisma.recipe.count()).toBe(0);
    });
  });

  describe('DELETE /recipes/:id', () => {
    it('deletes the current user recipe and its ingredients', async () => {
      const deleteSpy = mockCloudinaryDelete();
      const { user, authHeader } = await createAuthUser();
      const ingredient = await createIngredient('Flour');
      const recipe = await createRecipe(user.id, {
        title: 'Bread',
        ingredients: [{ ingredientId: ingredient.id, measure: '300g' }],
      });
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { thumbId: THUMB_ID },
      });

      const response = await request(app)
        .delete(`/recipes/${recipe.id}`)
        .set('Authorization', authHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Recipe deleted successfully' });
      expect(await prisma.recipe.findUnique({ where: { id: recipe.id } })).toBeNull();
      expect(await prisma.recipeIngredient.count({ where: { recipeId: recipe.id } })).toBe(0);
      expect(deleteSpy).toHaveBeenCalledWith(THUMB_ID);
    });

    it('returns 403 when deleting another user recipe', async () => {
      const owner = await createAuthUser();
      const stranger = await createAuthUser();
      const recipe = await createRecipe(owner.user.id, { title: 'Keep me' });

      const response = await request(app)
        .delete(`/recipes/${recipe.id}`)
        .set('Authorization', stranger.authHeader);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Access denied. You can only delete your own recipes',
      });
      expect(await prisma.recipe.findUnique({ where: { id: recipe.id } })).not.toBeNull();
    });

    it('returns 404 when the recipe does not exist', async () => {
      const { authHeader } = await createAuthUser();

      const response = await request(app)
        .delete('/recipes/missing-recipe-id')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Recipe not found',
      });
    });

    it('returns 401 when the user is not authenticated', async () => {
      const owner = await createAuthUser();
      const recipe = await createRecipe(owner.user.id);

      const response = await request(app).delete(`/recipes/${recipe.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized',
      });
    });
  });
});
