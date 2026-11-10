import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@repo/shared';

export { z };
export const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'Bearer',
});
