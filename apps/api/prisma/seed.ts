import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Prisma } from '@/generated/prisma/client';
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
};

function mapRawCategory(raw: RawMongoCategory): Prisma.CategoryCreateInput {
  return {
    id: raw._id.$oid,
    name: raw.name,
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
  await prisma.category.createMany({ data: categories, skipDuplicates: true });

  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
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

function mapRawRecipe(raw: RawMongoRecipe): Prisma.RecipeCreateInput {
  return {
    id: raw._id.$oid,
    title: raw.title,
    category: { connect: { name: raw.category } },
    owner: { connect: { id: raw.owner.$oid } },
    area: { connect: { name: raw.area } },
    instructions: raw.instructions,
    description: raw.description,
    thumb: raw.thumb,
    time: parseInt(raw.time, 10),
    ingredients: {
      create: raw.ingredients.map((ingredient) => ({
        ingredient: { connect: { id: ingredient.id } },
        measure: ingredient.measure,
      })),
    },
  };
}

type CreateRecipesParams = {
  users: Prisma.User[] | null;
  areas: Prisma.Area[] | null;
  categories: Prisma.Category[] | null;
  // ingredients: Prisma.Ingredient[] | null;
};

async function createRecipes({ users, areas, categories }: CreateRecipesParams) {
  const recipesFilePath = path.join(dataDir, 'recipes.json');
  const rawRecipes = await readJSONFile<RawMongoRecipe[]>(recipesFilePath);

  if (!rawRecipes) {
    console.error('No recipes data found.');
    return null;
  }
  const recipes: Prisma.RecipeCreateInput[] = rawRecipes.map(mapRawRecipe);
  if (!recipes || recipes.length === 0) {
    console.error('No recipes data found.');
    return null;
  }

  recipes.forEach(async (recipe) => {
    const user = users?.find((user) => user.id === recipe?.owner?.connect?.id);
    const area = areas?.find((area) => area.name === recipe?.area?.connect?.name);
    const category = categories?.find(
      (category) => category.name === recipe?.category?.connect?.name,
    );
    // const ingredient = ingredients?.filter((ingredient) => ingredient.id === recipe?.ingredients?.[0]?.ingredient?.connect?.id);

    if (user && area && category) {
      const rawRecipe: Prisma.RecipeCreateInput = {
        id: recipe.id,
        title: recipe.title,
        instructions: recipe.instructions,
        description: recipe.description,
        thumb: recipe.thumb,
        preview: recipe.preview,
        time: recipe.time,
        owner: { connect: { id: user.id } },
        area: { connect: { name: area.name } },
        category: { connect: { name: category.name } },
        ingredients: {
          create: recipe.ingredients?.create?.map((ingredient) => ({
            ingredient: { connect: { id: ingredient.ingredient.connect.id } },
            measure: ingredient.measure,
          })),
        },
      };

      try {
        await prisma.recipe.upsert({ where: { id: rawRecipe.id }, update: {}, create: rawRecipe });
      } catch (error) {
        console.error('Error upserting recipe:', error);
      }
    }
  });

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
