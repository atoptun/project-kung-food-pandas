import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extend Zod once in the shared contract package so all schemas support `.openapi()` metadata
extendZodWithOpenApi(z);

export { z };
export * from './schemas/auth.schema';
export * from './schemas/error.schema';
export * from './schemas/health.schema';
export * from './schemas/recipes.schema';
export * from './schemas/users.schema';
