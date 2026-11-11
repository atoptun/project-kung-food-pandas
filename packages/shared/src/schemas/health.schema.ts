import { z } from '../zod';

export const LivenessResponseSchema = z
  .object({
    status: z.literal('ok').openapi({ example: 'ok' }),
    timestamp: z.iso.datetime().openapi({ example: '2026-11-09T12:00:00.000Z' }),
    uptime: z.number().nonnegative().openapi({ example: 42.15 }),
  })
  .openapi('LivenessResponse');

export type LivenessResponse = z.infer<typeof LivenessResponseSchema>;

export const ReadinessResponseSchema = z
  .object({
    status: z.enum(['ready', 'degraded']).openapi({ example: 'ready' }),
    timestamp: z.iso.datetime().openapi({ example: '2026-11-09T12:00:00.000Z' }),
    checks: z.object({
      database: z.enum(['up', 'down']).openapi({ example: 'up' }),
    }),
  })
  .openapi('ReadinessResponse');

export type ReadinessResponse = z.infer<typeof ReadinessResponseSchema>;
