import { app } from '@/app';
import env from '@/config/env';
import logger from '@/config/logger';
import prisma from '@/lib/prisma';

const server = app.listen(env.PORT, () => {
  logger.info(`API server listening on http://localhost:${env.PORT}`);
  logger.info(`Swagger UI available at http://localhost:${env.PORT}/api-docs`);
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down server gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
