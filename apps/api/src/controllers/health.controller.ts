import type { LivenessResponse, ReadinessResponse } from '@repo/shared';
import { type Request, type Response } from 'express';

import prisma from '@/config/prisma.js';

export const handleLiveness = (_req: Request, res: Response<LivenessResponse>) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

export const handleReadiness = async (_req: Request, res: Response<ReadinessResponse>) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
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
