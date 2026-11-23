import { toSlug } from '@repo/shared';

import prisma from '@/lib/prisma';

export async function createCategory(name = 'Test Category') {
  return prisma.category.upsert({
    where: { name },
    update: {},
    create: { name, slug: toSlug(name) },
  });
}

export async function createArea(name = 'Test Area') {
  return prisma.area.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

export async function createIngredient(name: string) {
  return prisma.ingredient.create({
    data: {
      name,
      description: `${name} description`,
    },
  });
}

type RecipeOverrides = {
  title?: string;
  slug?: string | null;
  description?: string | null;
  instructions?: string | null;
  time?: number | null;
  thumb?: string | null;
  categoryId?: string;
  areaId?: string;
  ingredients?: { ingredientId: string; measure: string }[];
};

let testSlugCounter = 0;

export async function createRecipe(ownerId: string, overrides: RecipeOverrides = {}) {
  const categoryId = overrides.categoryId ?? (await createCategory()).id;
  const areaId = overrides.areaId ?? (await createArea()).id;
  const title = overrides.title ?? 'Test Recipe';
  testSlugCounter++;
  const slug =
    overrides.slug !== undefined ? overrides.slug : `${toSlug(title)}-${testSlugCounter}`;

  return prisma.recipe.create({
    data: {
      title,
      slug,
      description: overrides.description,
      instructions: overrides.instructions,
      time: overrides.time,
      thumb: overrides.thumb,
      ownerId,
      categoryId,
      areaId,
      ...(overrides.ingredients?.length
        ? {
            ingredients: {
              create: overrides.ingredients.map((item) => ({
                ingredientId: item.ingredientId,
                measure: item.measure,
              })),
            },
          }
        : {}),
    },
  });
}

export async function addFavorite(userId: string, recipeId: string) {
  return prisma.favoriteRecipe.create({
    data: { userId, recipeId },
  });
}
