import { Router } from 'express';

import { HealthController } from '@/controllers/health.controller';
import prisma from '@/lib/prisma';
import { HealthService } from '@/services/health.service';

const service = new HealthService(prisma);
const controller = new HealthController(service);

export const healthRouter: Router = Router();

healthRouter.get(['/healthz', '/health'], controller.handleLiveness);
healthRouter.get(['/readyz', '/ready'], controller.handleReadiness);
