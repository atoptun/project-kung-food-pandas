import {
  ApiErrorResponseSchema,
  LivenessResponseSchema,
  ReadinessResponseSchema,
} from '@repo/shared';

import { jsonResponse } from './helper';
import { registry } from './registry';

registry.register('LivenessResponse', LivenessResponseSchema);
registry.register('ReadinessResponse', ReadinessResponseSchema);
registry.register('ApiErrorResponse', ApiErrorResponseSchema);

registry.registerPath({
  method: 'get',
  path: '/healthz',
  tags: ['System'],
  summary: 'Liveness probe',
  description: 'Verifies that the process is alive.',
  responses: {
    200: jsonResponse('Process is alive', LivenessResponseSchema),
  },
});

registry.registerPath({
  method: 'get',
  path: '/readyz',
  tags: ['System'],
  summary: 'Readiness probe',
  description: 'Verifies that the service is ready to accept traffic.',
  responses: {
    200: jsonResponse('Service is ready to accept traffic', ReadinessResponseSchema),
    503: jsonResponse('Service is not ready to accept traffic', ReadinessResponseSchema),
  },
});
