import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const TinyRecipeItemSchema = z
  .object({
    id: z.string().openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d2' }),
    title: z.string().openapi({ example: 'Recipe 1' }),
    image: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: 'https://res.cloudinary.com/.../recipe1.jpg' }),
  })
  .openapi('TinyRecipeItem');

export const ShortRecipeItemSchema = z
  .object({
    id: z.string().openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d2' }),
    title: z.string().openapi({ example: 'Recipe 1' }),
    image: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: 'https://res.cloudinary.com/.../recipe1.jpg' }),
    shortDescription: z.string().optional().openapi({ example: 'Short description of Recipe 1' }),
  })
  .openapi('ShortRecipeItem');
