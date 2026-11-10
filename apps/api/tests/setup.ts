import { afterAll, beforeEach } from 'vitest';

import prisma from '@/lib/prisma';

import { cleanDatabase } from './helpers/db';

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});
