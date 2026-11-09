import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { app } from '@/app.js';
import prisma from '@/config/prisma.js';

describe('Health & Readiness Endpoints', () => {
  it('GET /healthz returns 200 OK liveness payload', async () => {
    const response = await request(app).get('/healthz');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'ok',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      }),
    );
  });

  it('GET /readyz returns 200 when database query succeeds', async () => {
    const spy = vi.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([1]);

    const response = await request(app).get('/readyz');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ready',
      timestamp: expect.any(String),
      checks: {
        database: 'up',
      },
    });

    spy.mockRestore();
  });

  it('GET /readyz returns 503 when database query fails', async () => {
    const spy = vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('DB down'));

    const response = await request(app).get('/readyz');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: 'degraded',
      timestamp: expect.any(String),
      checks: {
        database: 'down',
      },
    });

    spy.mockRestore();
  });
});
