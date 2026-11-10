import { describe, expect, it } from 'vitest';

import { LivenessResponseSchema } from '../../src/index';

describe('LivenessResponseSchema', () => {
  it('validates a valid liveness payload', () => {
    const parsed = LivenessResponseSchema.safeParse({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: 12.34,
    });

    expect(parsed.success).toBe(true);
  });
});
