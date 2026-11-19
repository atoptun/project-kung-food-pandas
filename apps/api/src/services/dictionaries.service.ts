import type { Area, Category, Ingredient } from '@repo/shared';

import type { PrismaClient } from '@/generated/prisma/client';

export class DictionariesService {
  constructor(private db: PrismaClient) {}

  getCategories = async (): Promise<Category[]> => {
    return this.db.category.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: { name: 'asc' },
    });
  };

  getAreas = async (): Promise<Area[]> => {
    return this.db.area.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  };

  getIngredients = async (): Promise<Ingredient[]> => {
    return await this.db.ingredient.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        img: true,
      },
      orderBy: { name: 'asc' },
    });
  };
}
