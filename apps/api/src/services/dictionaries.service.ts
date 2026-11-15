import type { Area, Category, Ingredient } from '@repo/shared';

import prisma from '@/lib/prisma.ts';

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getAllAreas = async (): Promise<Area[]> => {
  return prisma.area.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getAllIngredients = async (): Promise<Ingredient[]> => {
  const ingredients = await prisma.ingredient.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      img: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Преобразуємо null в пусту строку або гарантуємо відповідність типу
  return ingredients.map((item) => ({
    ...item,
    name: item.name ?? '', // гарантируємо, що name — это string, а ні null
  }));
};
