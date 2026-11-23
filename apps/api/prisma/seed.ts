import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { toSlug } from '@repo/shared';

import type { Area, Category, Prisma, User } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, 'data', 'foodies');

async function readJSONFile<T>(filePath: string): Promise<T | null> {
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading JSON file: ${filePath}`, error);
    return null;
  }
}

type RawMongoUser = {
  _id: { $oid: string };
  name: string;
  email: string;
  avatar: string | null;
};

function mapRawUser(raw: RawMongoUser): Prisma.UserCreateInput {
  return {
    id: raw._id.$oid,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar,
  };
}

async function createUsers() {
  const usersFilePath = path.join(dataDir, 'users.json');
  const rawUsers = await readJSONFile<RawMongoUser[]>(usersFilePath);

  if (!rawUsers) {
    console.error('No users data found.');
    return null;
  }
  const users: Prisma.UserCreateInput[] = rawUsers.map(mapRawUser);
  if (!users || users.length === 0) {
    console.error('No users data found.');
    return null;
  }
  await prisma.user.createMany({ data: users, skipDuplicates: true });

  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      avatarId: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

type RawMongoArea = {
  _id: { $oid: string };
  name: string;
};

function mapRawArea(raw: RawMongoArea): Prisma.AreaCreateInput {
  return {
    id: raw._id.$oid,
    name: raw.name,
  };
}

async function createAreas() {
  const areasFilePath = path.join(dataDir, 'areas.json');
  const rawAreas = await readJSONFile<RawMongoArea[]>(areasFilePath);

  if (!rawAreas) {
    console.error('No areas data found.');
    return null;
  }
  const areas: Prisma.AreaCreateInput[] = rawAreas.map(mapRawArea);
  if (!areas || areas.length === 0) {
    console.error('No areas data found.');
    return null;
  }
  await prisma.area.createMany({ data: areas, skipDuplicates: true });

  return await prisma.area.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

type RawMongoCategory = {
  _id: { $oid: string };
  name: string;
  image: string;
};

function mapRawCategory(raw: RawMongoCategory): Prisma.CategoryCreateInput {
  return {
    id: raw._id.$oid,
    name: raw.name,
    slug: toSlug(raw.name),
    image: raw.image,
  };
}

async function createCategories() {
  const categoriesFilePath = path.join(dataDir, 'categories.json');
  const rawCategories = await readJSONFile<RawMongoCategory[]>(categoriesFilePath);

  if (!rawCategories) {
    console.error('No categories data found.');
    return null;
  }
  const categories: Prisma.CategoryCreateInput[] = rawCategories.map(mapRawCategory);
  if (!categories || categories.length === 0) {
    console.error('No categories data found.');
    return null;
  }

  await prisma.$transaction(
    categories.map((category) =>
      prisma.category.upsert({
        where: { id: category.id },
        update: {
          name: category.name,
          slug: category.slug,
          image: category.image,
        },
        create: category,
      }),
    ),
  );

  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
    },
  });
}

type RawMongoIngredient = {
  _id: string;
  name: string;
  desc: string;
  img: string;
};

function mapRawIngredient(raw: RawMongoIngredient): Prisma.IngredientCreateInput {
  return {
    id: raw._id,
    name: raw.name,
    description: raw.desc,
    img: raw.img,
  };
}

async function createIngredients() {
  const ingredientsFilePath = path.join(dataDir, 'ingredients.json');
  const rawIngredients = await readJSONFile<RawMongoIngredient[]>(ingredientsFilePath);

  if (!rawIngredients) {
    console.error('No ingredients data found.');
    return null;
  }
  const ingredients: Prisma.IngredientCreateInput[] = rawIngredients.map(mapRawIngredient);
  if (!ingredients || ingredients.length === 0) {
    console.error('No ingredients data found.');
    return null;
  }
  await prisma.ingredient.createMany({ data: ingredients, skipDuplicates: true });

  return await prisma.ingredient.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      img: true,
    },
  });
}

/**{
  "_id": {
    "$oid": "647495d0c825f1570b04182d"
  },
   "owner": {
    "$oid": "64c8d958249fae54bae90bb9"
  },
    "testimonial": "Foodies has transformed my cooking experience! With its diverse recipe collection and user-friendly interface, I can easily find, save, and cook delicious meals for any occasion. From quick dinners to elaborate feasts, this app has become my go-to kitchen companion. Highly recommended!"
} */

type RawMongoTestimonial = {
  _id: { $oid: string };
  owner: { $oid: string };
  testimonial: string;
};

function mapRawTestimonial(raw: RawMongoTestimonial): Prisma.TestimonialCreateManyInput {
  return {
    id: raw._id.$oid,
    ownerId: raw.owner.$oid,
    testimonial: raw.testimonial,
  };
}

async function createTestimonials() {
  const testimonialsFilePath = path.join(dataDir, 'testimonials.json');
  const rawTestimonials = await readJSONFile<RawMongoTestimonial[]>(testimonialsFilePath);

  if (!rawTestimonials) {
    console.error('No testimonials data found.');
    return null;
  }
  const testimonials: Prisma.TestimonialCreateManyInput[] = rawTestimonials.map(mapRawTestimonial);
  if (!testimonials || testimonials.length === 0) {
    console.error('No testimonials data found.');
    return null;
  }
  await prisma.testimonial.createMany({ data: testimonials, skipDuplicates: true });

  return await prisma.testimonial.findMany({
    select: {
      id: true,
      owner: true,
      testimonial: true,
    },
  });
}

type RawMongoRecipe = {
  _id: { $oid: string };
  title: string;
  category: string;
  owner: { $oid: string };
  area: string;
  instructions: string;
  description: string;
  thumb: string;
  time: string;
  ingredients: {
    id: string;
    measure: string;
  }[];
};

type CreateRecipesParams = {
  users: User[] | null;
  areas: Area[] | null;
  categories: Category[] | null;
};

async function createRecipes({ users, areas, categories }: CreateRecipesParams) {
  const recipesFilePath = path.join(dataDir, 'recipes.json');
  const rawRecipes = await readJSONFile<RawMongoRecipe[]>(recipesFilePath);

  if (!rawRecipes || rawRecipes.length === 0) {
    console.error('No recipes data found.');
    return null;
  }

  const userIds = new Set(users?.map((user) => user.id));
  const areaNames = new Set(areas?.map((area) => area.name));
  const categoryNames = new Set(categories?.map((category) => category.name));

  // Set to prevent duplicate slugs during seeding
  const usedSlugs = new Set<string>();

  for (const raw of rawRecipes) {
    const ownerId = raw.owner?.$oid;
    const areaName = raw.area;
    const categoryName = raw.category;

    if (!userIds.has(ownerId) || !areaNames.has(areaName) || !categoryNames.has(categoryName)) {
      continue;
    }

    const baseSlug = toSlug(raw.title) || `recipe-${raw._id.$oid}`;
    let recipeSlug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(recipeSlug)) {
      recipeSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(recipeSlug);

    const recipeData: Prisma.RecipeCreateInput = {
      id: raw._id.$oid,
      title: raw.title,
      slug: recipeSlug,
      instructions: raw.instructions,
      description: raw.description,
      thumb: raw.thumb,
      time: raw.time ? parseInt(raw.time, 10) : null,
      owner: { connect: { id: ownerId } },
      area: { connect: { name: areaName } },
      category: { connect: { name: categoryName } },
      ingredients: {
        create: (raw.ingredients ?? []).map((ingredient) => ({
          ingredient: { connect: { id: ingredient.id } },
          measure: ingredient.measure,
        })),
      },
    };

    try {
      await prisma.recipe.upsert({
        where: { id: recipeData.id },
        update: {
          title: recipeData.title,
          slug: recipeData.slug,
          instructions: recipeData.instructions,
          description: recipeData.description,
          thumb: recipeData.thumb,
          time: recipeData.time,
          ingredients: {
            deleteMany: {},
            create: (raw.ingredients ?? []).map((ingredient) => ({
              ingredient: { connect: { id: ingredient.id } },
              measure: ingredient.measure,
            })),
          },
        },
        create: recipeData,
      });
    } catch (error) {
      console.error(`Error upserting recipe ${raw._id.$oid}:`, error);
    }
  }

  return await prisma.recipe.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      owner: true,
      area: true,
      instructions: true,
      description: true,
      thumb: true,
      time: true,
      ingredients: {
        select: {
          ingredientId: true,
          measure: true,
        },
      },
    },
  });
}

async function main() {
  console.log('Seeding database...');
  const users = await createUsers();
  const areas = await createAreas();
  const categories = await createCategories();
  const _ingredients = await createIngredients();
  const _testimonials = await createTestimonials();
  const _recipes = await createRecipes({
    users,
    areas,
    categories,
    // ingredients,
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
