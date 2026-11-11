import {
  AreaResponseSchema,
  CategoryResponseSchema,
  IngredientResponseSchema,
  TestimonialResponseSchema,
} from '@repo/shared';

import { jsonResponse } from './helper';
import { registry } from './registry';

const TAG = ['Dictionaries'];

registry.register('AreaResponse', AreaResponseSchema);

registry.registerPath({
  method: 'get',
  path: '/areas',
  tags: TAG,
  summary: 'Get list of all areas',
  responses: {
    200: jsonResponse('List of areas retrieved successfully', AreaResponseSchema.array()),
  },
});

registry.register('CategoryResponse', CategoryResponseSchema);

registry.registerPath({
  method: 'get',
  path: '/categories',
  tags: TAG,
  summary: 'Get list of all categories',
  responses: {
    200: jsonResponse('List of categories retrieved successfully', CategoryResponseSchema.array()),
  },
});

registry.register('IngredientResponse', IngredientResponseSchema);

registry.registerPath({
  method: 'get',
  path: '/ingredients',
  tags: TAG,
  summary: 'Get list of all ingredients',
  responses: {
    200: jsonResponse(
      'List of ingredients retrieved successfully',
      IngredientResponseSchema.array(),
    ),
  },
});

registry.register('TestimonialResponse', TestimonialResponseSchema);

registry.registerPath({
  method: 'get',
  path: '/testimonials',
  tags: TAG,
  summary: 'Get list of all testimonials',
  responses: {
    200: jsonResponse(
      'List of testimonials retrieved successfully',
      TestimonialResponseSchema.array(),
    ),
  },
});
