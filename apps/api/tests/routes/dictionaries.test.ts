import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '@/app';

import { createArea, createCategory, createIngredient } from '../helpers/recipes';

describe('Dictionaries Endpoints', () => {
  describe('GET /categories', () => {
    it('returns 200 OK with array of categories sorted by name', async () => {
      const catB = await createCategory(`B Category ${Date.now()}`);
      const catA = await createCategory(`A Category ${Date.now()}`);

      const response = await request(app).get('/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: catA.id, name: catA.name }),
          expect.objectContaining({ id: catB.id, name: catB.name }),
        ]),
      );
    });
  });

  describe('GET /areas', () => {
    it('returns 200 OK with array of areas sorted by name', async () => {
      const areaB = await createArea(`B Area ${Date.now()}`);
      const areaA = await createArea(`A Area ${Date.now()}`);

      const response = await request(app).get('/areas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: areaA.id, name: areaA.name }),
          expect.objectContaining({ id: areaB.id, name: areaB.name }),
        ]),
      );
    });
  });

  describe('GET /ingredients', () => {
    it('returns 200 OK with array of ingredients sorted by name', async () => {
      const ingB = await createIngredient(`B Ingredient ${Date.now()}`);
      const ingA = await createIngredient(`A Ingredient ${Date.now()}`);

      const response = await request(app).get('/ingredients');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: ingA.id,
            name: ingA.name,
            description: ingA.description,
          }),
          expect.objectContaining({
            id: ingB.id,
            name: ingB.name,
            description: ingB.description,
          }),
        ]),
      );
    });
  });
});
