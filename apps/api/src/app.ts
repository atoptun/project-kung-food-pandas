import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import env from '@/config/env.js';
import logger from '@/config/logger.js';
import { generateOpenApiDocument } from '@/docs/openapi.js';
import { errorHandler } from '@/middlewares/error-handler.middleware.js';
import { notFound } from '@/middlewares/not-found.middleware';
import { healthRouter } from '@/routes/health.routes.js';

export function createApp(): Express {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['X-Total-Count'],
      credentials: true,
      maxAge: 86400,
    }),
  );
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  const openApiDocument = generateOpenApiDocument();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use(healthRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
