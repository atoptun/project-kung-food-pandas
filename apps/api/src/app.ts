import { toNodeHandler } from 'better-auth/node';
import compression from 'compression';
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
import { apiRateLimiter, authRateLimiter } from '@/middlewares/rate-limit.middleware';
// import { authRouter } from '@/routes/auth.routes';
import { dictionariesRouter } from '@/routes/dictionaries.routes';
import { favoritesRouter } from '@/routes/favorites.routes';
import { healthRouter } from '@/routes/health.routes';
import { recipesRouter } from '@/routes/recipes.routes';
import { testimonialsRouter } from '@/routes/testimonials.routes';
import { usersRouter } from '@/routes/users.routes';

export async function createApp(): Promise<Express> {
  const app = express();

  if (env.NODE_ENV === 'production') {
    // Render architecture uses a single reverse proxy layer in front of the container
    app.set('trust proxy', env.TRUST_PROXY);
  } else {
    app.set('trust proxy', false);
  }

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(
    compression({
      threshold: 1024,
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

  app.use('/api/auth', authRateLimiter);
  app.all('/api/auth/*any', toNodeHandler(auth));

  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use(apiRateLimiter);

  const openApiDocument = await generateOpenApiDocument();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use(healthRouter);
  app.use(dictionariesRouter);
  app.use('/users', usersRouter);
  // Must stay before the `/recipes` router: otherwise `GET /recipes/:id` would catch `/favorites`.
  app.use('/recipes/favorites', favoritesRouter);
  app.use('/recipes', recipesRouter);
  app.use('/testimonials', testimonialsRouter);

  // NOT USED. USE 'BetterAuth' INSTEAD. KEEPING FOR REFERENCE.
  // app.use('/auth', authRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export const app = await createApp();
