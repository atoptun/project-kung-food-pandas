import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  ApiErrorResponseSchema,
  LivenessResponseSchema,
  ReadinessResponseSchema,
} from '@repo/shared';

export const openApiRegistry = new OpenAPIRegistry();

openApiRegistry.register('LivenessResponse', LivenessResponseSchema);
openApiRegistry.register('ReadinessResponse', ReadinessResponseSchema);
openApiRegistry.register('ApiErrorResponse', ApiErrorResponseSchema);

openApiRegistry.registerPath({
  method: 'get',
  path: '/healthz',
  tags: ['System'],
  summary: 'Liveness probe',
  description: 'Verifies that the process is alive.',
  responses: {
    200: {
      description: 'Process is alive',
      content: {
        'application/json': {
          schema: LivenessResponseSchema,
        },
      },
    },
  },
});

openApiRegistry.registerPath({
  method: 'get',
  path: '/readyz',
  tags: ['System'],
  summary: 'Readiness probe',
  description: 'Verifies that the service is ready to accept traffic.',
  responses: {
    200: {
      description: 'Service is ready to accept traffic',
      content: {
        'application/json': {
          schema: ReadinessResponseSchema,
        },
      },
    },
    503: {
      description: 'Service is not ready to accept traffic',
      content: {
        'application/json': {
          schema: ReadinessResponseSchema,
        },
      },
    },
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

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
        url: 'http://localhost:4000',
        description: 'Local Development Server',
      },
      {
        url: 'https://kung-food-pandas-api.onrender.com',
        description: 'Production Server (Render)',
      },
    ],
  });
}
