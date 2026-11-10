import type { ResponseConfig, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { ApiErrorResponseSchema, type z } from '@repo/shared';

export const jsonResponse = (description: string, schema?: z.ZodType): ResponseConfig => ({
  description,
  content: schema
    ? {
        'application/json': {
          schema,
        },
      }
    : undefined,
});

export const jsonBody = (schema: z.ZodType): ZodRequestBody => ({
  content: {
    'application/json': {
      schema,
    },
  },
});

export const jsonOrMultipartBody = (
  jsonSchema: z.ZodType,
  multipartSchema: z.ZodType,
): ZodRequestBody => ({
  content: {
    'multipart/form-data': {
      schema: multipartSchema,
    },
    'application/json': {
      schema: jsonSchema,
    },
  },
});

export const errorResponse = (description: string, exampleMessage?: string): ResponseConfig => ({
  description,
  content: {
    'application/json': {
      schema: ApiErrorResponseSchema,
      example: {
        status: 'error',
        message: exampleMessage ?? description,
      },
    },
  },
});
