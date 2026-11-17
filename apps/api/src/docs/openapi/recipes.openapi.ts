import {
  CreateRecipeMultipartSchema,
  CreateRecipeSchema,
  PaginationQuerySchema,
  PopularRecipesQuerySchema,
  RecipeActionResponseSchema,
  RecipeCardSchema,
  RecipeDetailsSchema,
  RecipeFilterQuerySchema,
  RecipeIdParamSchema,
  RecipesListResponseSchema,
  z,
} from '@repo/shared';

import { errorResponse, jsonOrMultipartBody, jsonResponse } from './helper';
import { registry } from './registry';

registry.register('RecipeIdParam', RecipeIdParamSchema);
registry.register('RecipeFilterQuery', RecipeFilterQuerySchema);
registry.register('PopularRecipesQuery', PopularRecipesQuerySchema);
registry.register('CreateRecipeRequest', CreateRecipeSchema);
registry.register('CreateRecipeMultipartRequest', CreateRecipeMultipartSchema);
registry.register('RecipeCard', RecipeCardSchema);
registry.register('RecipeDetails', RecipeDetailsSchema);
registry.register('RecipesListResponse', RecipesListResponseSchema);
registry.register('RecipeActionResponse', RecipeActionResponseSchema);

const TAG = ['Recipes'];

registry.registerPath({
  method: 'get',
  path: '/recipes',
  tags: TAG,
  summary: 'Search recipes with filters and pagination',
  description: 'Filter recipes by category, area, or ingredient with pagination support.',
  request: {
    query: RecipeFilterQuerySchema,
  },
  responses: {
    200: jsonResponse('List of filtered recipes', RecipesListResponseSchema),
    400: errorResponse('Invalid query parameters'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/recipes/popular',
  tags: TAG,
  summary: 'Get popular recipes',
  description: 'Returns top recipes sorted by number of users who added them to favorites.',
  request: {
    query: PopularRecipesQuerySchema,
  },
  responses: {
    200: jsonResponse('List of popular recipes', z.array(RecipeCardSchema)),
  },
});

registry.registerPath({
  method: 'get',
  path: '/recipes/own',
  tags: TAG,
  summary: 'Get current user recipes',
  description: 'Returns recipes created by the authenticated user.',
  security: [{ bearerAuth: [] }],
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: jsonResponse('List of user own recipes', RecipesListResponseSchema),
    401: errorResponse('Not authorized'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/recipes/favorites',
  tags: TAG,
  summary: 'Get current user favorite recipes',
  description: 'Returns all recipes added to favorites by the authenticated user with pagination.',
  security: [{ bearerAuth: [] }],
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: jsonResponse('List of favorite recipes', RecipesListResponseSchema),
    401: errorResponse('Not authorized'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/recipes/{id}',
  tags: TAG,
  summary: 'Get recipe details by ID',
  description:
    'Returns full recipe information including area, category, owner, and detailed ingredients.',
  request: {
    params: RecipeIdParamSchema,
  },
  responses: {
    200: jsonResponse('Recipe details retrieved successfully', RecipeDetailsSchema),
    404: errorResponse('Recipe not found'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/recipes',
  tags: TAG,
  summary: 'Create a new recipe',
  description:
    'Creates a custom recipe for the authenticated user. Supports both JSON body and multipart/form-data upload.',
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonOrMultipartBody(CreateRecipeSchema, CreateRecipeMultipartSchema),
  },
  responses: {
    201: jsonResponse('Recipe created successfully', RecipeDetailsSchema),
    400: errorResponse('Invalid input data or image format'),
    401: errorResponse('Not authorized'),
    422: errorResponse('Validation failed'),
  },
});

registry.registerPath({
  method: 'delete',
  path: '/recipes/{id}',
  tags: TAG,
  summary: 'Delete own recipe',
  description:
    'Deletes a recipe created by the authenticated user. User cannot delete another user recipe.',
  security: [{ bearerAuth: [] }],
  request: {
    params: RecipeIdParamSchema,
  },
  responses: {
    200: jsonResponse('Recipe deleted successfully', RecipeActionResponseSchema),
    401: errorResponse('Not authorized'),
    403: errorResponse('Access denied. You can only delete your own recipes'),
    404: errorResponse('Recipe not found'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/recipes/favorites/{id}',
  tags: TAG,
  summary: 'Add recipe to favorites',
  description: 'Adds the specified recipe to current user favorites list.',
  security: [{ bearerAuth: [] }],
  request: {
    params: RecipeIdParamSchema,
  },
  responses: {
    200: jsonResponse('Recipe added to favorites successfully', RecipeActionResponseSchema),
    401: errorResponse('Not authorized'),
    404: errorResponse('Recipe not found'),
    409: errorResponse('Recipe is already in favorites'),
  },
});

registry.registerPath({
  method: 'delete',
  path: '/recipes/favorites/{id}',
  tags: TAG,
  summary: 'Remove recipe from favorites',
  description: 'Removes the specified recipe from current user favorites list.',
  security: [{ bearerAuth: [] }],
  request: {
    params: RecipeIdParamSchema,
  },
  responses: {
    200: jsonResponse('Recipe removed from favorites successfully', RecipeActionResponseSchema),
    401: errorResponse('Not authorized'),
    404: errorResponse('Recipe not found or not in favorites'),
  },
});
