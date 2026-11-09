import { app } from '@/app.js';
import env from '@/config/env.js';
import logger from '@/config/logger.js';
import prisma from '@/config/prisma.js';

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
