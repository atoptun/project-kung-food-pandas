import { Prisma } from '@/generated/prisma/client';

/** Prisma error codes the services translate into domain errors. */
export const PrismaErrorCode = {
  UniqueConstraint: 'P2002',
  ForeignKeyConstraint: 'P2003',
} as const;

type PrismaErrorCodeValue = (typeof PrismaErrorCode)[keyof typeof PrismaErrorCode];

export function isPrismaError(
  error: unknown,
  code: PrismaErrorCodeValue,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}
