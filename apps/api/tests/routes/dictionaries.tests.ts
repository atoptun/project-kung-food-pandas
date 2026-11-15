import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { app } from '@/app.ts';
import prisma from '@/lib/prisma.ts';

vi.mock('@/lib/prisma.ts', () => ({
  prisma: {
    category: { findMany: vi.fn() },
    area: { findMany: vi.fn() },
    ingredient: { findMany: vi.fn() },
  },
}));

describe('Dictionaries Endpoints (Public Access & Contracts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /categories', () => {
    it('returns 200 and array of categories without authentication', async () => {
      const mockCategories = [
        { id: '6462a6cd4c3d0ddd28897f8f', name: 'Dessert', img: null },
        { id: '6462a6cd4c3d0ddd28897f90', name: 'Seafood', img: null },
      ];
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories);

      const res = await request(app).get('/categories');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCategories);
    });

    it('returns 200 and empty array when database has no categories', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue([]);

      const res = await request(app).get('/categories');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /areas', () => {
    it('returns 200 and array of areas without authentication', async () => {
      const mockAreas = [{ id: '6462a6f04c3d0ddd28897f9b', name: 'Ukrainian' }];
      vi.mocked(prisma.area.findMany).mockResolvedValue(mockAreas);

      const res = await request(app).get('/areas');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAreas);
    });

    it('returns 200 and empty array when database has no areas', async () => {
      vi.mocked(prisma.area.findMany).mockResolvedValue([]);

      const res = await request(app).get('/areas');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /ingredients', () => {
    it('returns 200 and array of ingredients matching contract', async () => {
      const mockIngredients = [
        {
          id: '640c2dd963a319ea671e382c',
          name: 'Pears',
          description: 'A sweet and juicy fruit.',
          img: 'https://res.cloudinary.com/demo/image/upload/pears.jpg',
        },
        {
          id: '640c2dd963a319ea671e382d',
          name: 'Salt',
          description: null,
          img: null,
        },
      ];
      vi.mocked(prisma.ingredient.findMany).mockResolvedValue(mockIngredients);

      const res = await request(app).get('/ingredients');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockIngredients);
    });

    it('returns 200 and empty array when database has no ingredients', async () => {
      vi.mocked(prisma.ingredient.findMany).mockResolvedValue([]);

      const res = await request(app).get('/ingredients');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });
});
