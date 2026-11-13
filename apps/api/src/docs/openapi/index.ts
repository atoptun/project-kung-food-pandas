// import './auth.openapi';
import './dictionaries.openapi';
import './health.openapi';
import './recipes.openapi';
import './users.openapi';

import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { auth } from '@/lib/auth';

import { registry } from './registry';

export async function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const baseDoc = generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Kung Food Pandas API',
      version: '0.1.0',
      description: 'REST API documentation for Kung Food Pandas.',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    tags: [
      { name: 'System', description: 'Health and readiness probes' },
      { name: 'BetterAuth', description: 'Authentication and session management' },
      { name: 'Users', description: 'User profile and relationships' },
      { name: 'Recipes', description: 'Recipes catalog and operations' },
      { name: 'Dictionaries', description: 'Categories, ingredients, areas, and testimonials' },
    ],
    servers: [
      {
        url: '/',
        description: 'Current Server',
      },
      {
        url: 'https://project-kung-food-pandas.onrender.com',
        description: 'Production (Render)',
      },
      {
        url: 'http://localhost:4000',
        description: 'Local Development Server',
      },
    ],
  });

  const rawAuthSchema = await auth.api.generateOpenAPISchema();

  const rawAuthPaths = Object.fromEntries(
    Object.entries(rawAuthSchema.paths ?? {}).map(([path, pathItem]) => {
      const updatedItem = { ...pathItem };

      for (const method of ['get', 'post', 'put', 'delete', 'patch'] as const) {
        if (updatedItem[method]) {
          updatedItem[method] = {
            ...updatedItem[method],
            tags: ['BetterAuth'],
          };
        }
      }

      return [path, updatedItem];
    }),
  );

  return {
    ...baseDoc,
    paths: {
      ...baseDoc.paths,
      ...rawAuthPaths,
    },
    components: {
      ...baseDoc.components,
      ...rawAuthSchema.components,
      schemas: {
        ...baseDoc.components?.schemas,
        ...rawAuthSchema.components?.schemas,
      },
    },
  };
}
