import prisma from '@/lib/prisma';

export async function cleanDatabase() {
  await prisma.user.deleteMany();
}
