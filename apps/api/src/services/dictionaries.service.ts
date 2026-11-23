import type { Area, Category, Ingredient } from '@repo/shared';

import type { PrismaClient } from '@/generated/prisma/client';

export class DictionariesService {
  private categoriesCache: Category[] | null = null;
  private areasCache: Area[] | null = null;
  private ingredientsCache: Ingredient[] | null = null;

  constructor(private db: PrismaClient) {}

  getCategories = async (): Promise<Category[]> => {
    if (this.categoriesCache) {
      return this.categoriesCache;
    }

    const categories = await this.db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
      },
      orderBy: { name: 'asc' },
    });

    const sorted = categories.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
    this.categoriesCache = sorted;
    return sorted;
  };

  getAreas = async (): Promise<Area[]> => {
    if (this.areasCache) {
      return this.areasCache;
    }

    const areas = await this.db.area.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
    const sorted = areas.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
    this.areasCache = sorted;
    return sorted;
  };

  getIngredients = async (): Promise<Ingredient[]> => {
    if (this.ingredientsCache) {
      return this.ingredientsCache;
    }

    const ingredients = await this.db.ingredient.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        img: true,
      },
      orderBy: { name: 'asc' },
    });
    const sorted = ingredients.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    );
    this.ingredientsCache = sorted;
    return sorted;
  };
}
