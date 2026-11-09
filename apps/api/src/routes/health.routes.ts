import { Router } from 'express';

import { handleLiveness, handleReadiness } from '@/controllers/health.controller';

export const healthRouter: Router = Router();

healthRouter.get(['/healthz', '/health'], handleLiveness);
healthRouter.get(['/readyz', '/ready'], handleReadiness);
