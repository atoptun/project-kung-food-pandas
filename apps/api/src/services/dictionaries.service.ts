import type { Area, Category, Ingredient } from '@repo/shared';

import type { PrismaClient } from '@/generated/prisma/client';

export class DictionariesService {
  constructor(private db: PrismaClient) {}

  getCategories = async (): Promise<Category[]> => {
    const categories = await this.db.category.findMany({
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: { name: 'asc' },
    });

    return categories.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  };

  getAreas = async (): Promise<Area[]> => {
    const areas = await this.db.area.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
    return areas.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  };

  getIngredients = async (): Promise<Ingredient[]> => {
    const ingredients = await this.db.ingredient.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        img: true,
      },
      orderBy: { name: 'asc' },
    });
    return ingredients.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
  };
}
