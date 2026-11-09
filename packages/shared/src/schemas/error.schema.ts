import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ApiErrorResponseSchema = z
  .object({
    status: z.literal('error').openapi({ example: 'error' }),
    message: z.string().openapi({ example: 'Validation failed' }),
    issues: z
      .array(
        z.object({
          path: z.string().openapi({ example: 'body.email' }),
          message: z.string().openapi({ example: 'Invalid email address' }),
        }),
      )
      .optional(),
  })
  .openapi('ApiErrorResponse');

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
