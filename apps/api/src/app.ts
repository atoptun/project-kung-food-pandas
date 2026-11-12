import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import env from '@/config/env';
import logger from '@/config/logger';
import { generateOpenApiDocument } from '@/docs/openapi';
import { auth } from '@/lib/auth';
import { errorHandler } from '@/middlewares/error-handler.middleware';
import { notFound } from '@/middlewares/not-found.middleware';
// import { authRouter } from '@/routes/auth.routes';
import { healthRouter } from '@/routes/health.routes';

export async function createApp(): Promise<Express> {
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

  app.all('/api/auth/*any', toNodeHandler(auth));

  app.use(express.json());
  app.use(pinoHttp({ logger }));

  const openApiDocument = await generateOpenApiDocument();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use(healthRouter);
  // NOT USED. USE 'BetterAuth' INSTEAD. KEEPING FOR REFERENCE.
  // app.use('/auth', authRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export const app = await createApp();
