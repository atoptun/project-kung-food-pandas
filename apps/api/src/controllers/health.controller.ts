import type { LivenessResponse, ReadinessResponse } from '@repo/shared';
import { type Request, type Response } from 'express';

import type { HealthService } from '@/services/health.service';

export class HealthController {
  constructor(private service: HealthService) {}

  handleLiveness = (_req: Request, res: Response<LivenessResponse>) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };

  handleReadiness = async (_req: Request, res: Response<ReadinessResponse>) => {
    try {
      await this.service.checkDatabase();
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'up',
        },
      });
    } catch {
      res.status(503).json({
        status: 'degraded',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'down',
        },
      });
    }
  };
}
