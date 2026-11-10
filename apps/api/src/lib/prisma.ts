import { PrismaPg } from '@prisma/adapter-pg';

import env from '@/config/env';
import logger from '@/config/logger';
import { PrismaClient } from '@/generated/prisma/client';

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });

  const client = new PrismaClient({
    adapter,
    log: [
      { level: 'query', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  });

  client.$on('query', (event) => {
    logger.debug(
      { query: event.query, params: event.params, durationMs: event.duration },
      'Prisma query',
    );
  });

  client.$on('warn', (event) => {
    logger.warn({ target: event.target }, event.message);
  });

  client.$on('error', (event) => {
    logger.error({ target: event.target }, event.message);
  });

  return client;
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Reuse PrismaClient across hot reloads in development (`tsx watch`) to avoid exhausting DB connections
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (!env.IS_PROD) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
