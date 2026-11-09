import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Extend Zod once in the shared contract package so all schemas support `.openapi()` metadata
extendZodWithOpenApi(z);

export { z };
export * from './schemas/error.schema.js';
export * from './schemas/health.schema.js';
