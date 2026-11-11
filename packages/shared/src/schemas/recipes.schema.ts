import { z } from '../zod';
import { PublicUserSchema } from './auth.schema';
import { IngredientResponseSchema } from './dictionaries.schema';
import { PaginationMetaSchema, PaginationQuerySchema } from './pagination.schema';

export const RecipeIdParamSchema = z
  .object({
    id: z.string().max(36).openapi({ example: '64c8d958249fae54bae90bb9' }),
  })
  .openapi('RecipeIdParam');

export const RecipeFilterQuerySchema = PaginationQuerySchema.extend({
  category: z
    .string()
    .optional()
    .openapi({ description: 'Category ID', example: '6462a6cd4c3d0ddd28897f8f' }),
  area: z
    .string()
    .optional()
    .openapi({ description: 'Area ID', example: '6462a6f04c3d0ddd28897f9b' }),
  ingredient: z
    .string()
    .optional()
    .openapi({ description: 'Ingredient ID', example: '640c2dd963a319ea671e382c' }),
}).openapi('RecipeFilterQuery');

export const PopularRecipesQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(50).default(4).openapi({ example: 4 }),
  })
  .openapi('PopularRecipesQuery');

export const RecipeIngredientInputSchema = z
  .object({
    id: z.string().max(32).openapi({ example: '64c8d958249fae54bae90bb1' }),
    measure: z.string().min(1).max(100).openapi({ example: '200g' }),
  })
  .openapi('RecipeIngredientInput');

export const CreateRecipeSchema = z
  .object({
    title: z.string().min(2).max(255).openapi({ example: 'Spaghetti Bolognese' }),
    description: z.string().optional().openapi({ example: 'Classic Italian rich pasta dish' }),
    instructions: z.string().min(10).openapi({ example: '1. Boil water. 2. Cook pasta...' }),
    categoryId: z.string().max(32).openapi({ example: '6462a6cd4c3d0ddd28897f8f' }),
    areaId: z.string().max(32).openapi({ example: '6462a6f04c3d0ddd28897f9b' }),
    time: z.coerce.number().int().positive().optional().openapi({ example: 45 }),
    ingredients: z.union([
      z.array(RecipeIngredientInputSchema),
      z
        .string()
        .transform((str, ctx) => {
          try {
            return JSON.parse(str) as Array<{ id: string; measure: string }>;
          } catch {
            ctx.addIssue({
              code: 'custom',
              message: 'Invalid JSON format for ingredients',
            });
            return z.NEVER;
          }
        })
        .pipe(z.array(RecipeIngredientInputSchema)),
    ]),
  })
  .openapi('CreateRecipeRequest');

export const CreateRecipeMultipartSchema = CreateRecipeSchema.extend({
  thumb: z.any().optional().openapi({
    type: 'string',
    format: 'binary',
    description: 'Recipe image file (jpg, png, webp; max 5MB)',
  }),
}).openapi('CreateRecipeMultipart');

export const RecipeIngredientDetailSchema = IngredientResponseSchema.extend({
  measure: z.string().nullable().optional().openapi({ example: '500g' }),
}).openapi('RecipeIngredientDetail');

export const RecipeTinyCardSchema = z
  .object({
    id: z.string().openapi({ example: '64c8d958249fae54bae90bb9' }),
    title: z.string().openapi({ example: 'Recipe 1' }),
    thumb: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: 'https://res.cloudinary.com/.../thumb.jpg' }),
  })
  .openapi('RecipeTinyCard');

export const RecipeShortCardSchema = RecipeTinyCardSchema.extend({
  description: z
    .string()
    .nullable()
    .optional()
    .openapi({ example: 'Classic Italian rich pasta dish' }),
}).openapi('RecipeShortCard');

export const RecipeCardSchema = RecipeShortCardSchema.extend({
  time: z.number().nullable().optional().openapi({ example: 45 }),
  favoritesCount: z.number().int().nonnegative().optional().openapi({ example: 12 }),
  owner: PublicUserSchema.optional().openapi({ description: 'Recipe owner information' }),
}).openapi('RecipeCard');

export const RecipeDetailsSchema = RecipeCardSchema.extend({
  instructions: z
    .string()
    .nullable()
    .optional()
    .openapi({ example: '1. Cook pasta. 2. Make sauce...' }),
  category: z
    .object({
      id: z.string().openapi({ example: 'cat-1' }),
      name: z.string().openapi({ example: 'Beef' }),
    })
    .optional(),
  area: z
    .object({
      id: z.string().openapi({ example: 'area-1' }),
      name: z.string().openapi({ example: 'Italian' }),
    })
    .optional(),
  ingredients: z
    .array(RecipeIngredientDetailSchema)
    .openapi({ description: 'Full ingredients list with descriptions' }),
}).openapi('RecipeDetails');

export const RecipesListResponseSchema = PaginationMetaSchema.extend({
  items: z.array(RecipeCardSchema),
}).openapi('RecipesListResponse');

export const RecipeActionResponseSchema = z
  .object({
    message: z.string().openapi({ example: 'Operation successful' }),
  })
  .openapi('RecipeActionResponse');

export type RecipeIdParam = z.infer<typeof RecipeIdParamSchema>;
export type RecipeFilterQuery = z.infer<typeof RecipeFilterQuerySchema>;
export type PopularRecipesQuery = z.infer<typeof PopularRecipesQuerySchema>;
export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;
export type RecipeCard = z.infer<typeof RecipeCardSchema>;
export type RecipeDetails = z.infer<typeof RecipeDetailsSchema>;
export type RecipesListResponse = z.infer<typeof RecipesListResponseSchema>;
export type RecipeActionResponse = z.infer<typeof RecipeActionResponseSchema>;
