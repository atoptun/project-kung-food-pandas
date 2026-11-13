import { PublicUserSchema } from '../index';
import { z } from '../zod';
import { PaginationMetaSchema } from './pagination.schema';

export const AreaResponseSchema = z
  .object({
    id: z.string().max(32).openapi({ example: '6462a6f04c3d0ddd28897f9b' }),
    name: z.string().max(255).openapi({ example: 'Ukrainian' }),
  })
  .openapi('Area');

export const CategoryResponseSchema = z
  .object({
    id: z.string().max(32).openapi({ example: '6462a6cd4c3d0ddd28897f8f' }),
    name: z.string().max(100).openapi({ example: 'Dessert' }),
    image: z.url().nullish().openapi({
      example:
        'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Desserts.jpg',
    }),
  })
  .openapi('Category');

export const IngredientResponseSchema = z.object({
  id: z.string().max(32).openapi({ example: '640c2dd963a319ea671e382c' }),
  name: z.string().max(255).openapi({ example: 'Pears' }),
  description: z
    .string()
    .nullish()
    .openapi({ example: 'A sweet and juicy fruit with a soft, grainy texture and thin skin.' }),
  img: z.url().nullish().openapi({ example: 'https://res.cloudinary.com/.../pears.jpg' }),
});

export const TestimonialResponseSchema = z
  .object({
    id: z.string().openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d2' }),
    testimonial: z.string().openapi({ example: 'This is a testimonial message.' }),
    owner: PublicUserSchema,
  })
  .openapi('Testimonial');

export const TestimonialsListResponseSchema = PaginationMetaSchema.extend({
  items: z.array(TestimonialResponseSchema),
}).openapi('TestimonialsListResponse');

export type Area = z.infer<typeof AreaResponseSchema>;
export type Category = z.infer<typeof CategoryResponseSchema>;
export type Ingredient = z.infer<typeof IngredientResponseSchema>;
export type Testimonial = z.infer<typeof TestimonialResponseSchema>;
export type TestimonialsListResponse = z.infer<typeof TestimonialsListResponseSchema>;
