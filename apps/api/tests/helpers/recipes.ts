import prisma from '@/lib/prisma';

async function ensureDictionaries() {
  const category = await prisma.category.upsert({
    where: { name: 'Test Category' },
    update: {},
    create: { name: 'Test Category' },
  });
  const area = await prisma.area.upsert({
    where: { name: 'Test Area' },
    update: {},
    create: { name: 'Test Area' },
  });

  return { category, area };
}

export async function createRecipe(ownerId: string, overrides: Partial<{ title: string }> = {}) {
  const { category, area } = await ensureDictionaries();

  return prisma.recipe.create({
    data: {
      title: overrides.title ?? 'Test Recipe',
      ownerId,
      categoryId: category.id,
      areaId: area.id,
    },
  });
}

export async function addFavorite(userId: string, recipeId: string) {
  return prisma.favoriteRecipe.create({
    data: { userId, recipeId },
  });
}
