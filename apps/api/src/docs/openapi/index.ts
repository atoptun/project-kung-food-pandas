import './auth.openapi';
import './health.openapi';
import './users.openapi';

import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { registry } from './registry';

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
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
}
