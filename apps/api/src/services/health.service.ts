import logger from '@/config/logger';
import type { PrismaClient } from '@/generated/prisma/client';

export class HealthService {
  constructor(private db: PrismaClient) {}

  checkDatabase = async (): Promise<boolean> => {
    try {
      await this.db.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error(error, 'Database connection check failed');
      throw error;
    }
  };
}
