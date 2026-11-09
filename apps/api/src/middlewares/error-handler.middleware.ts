import type { ApiErrorResponse } from '@repo/shared';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import logger from '@/config/logger.js';
import { HttpError } from '@/errors/http.error.js';

export function errorHandler(
  err: Error & { type?: string; code?: string },
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction,
) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      issues: [
        {
          path: 'body',
          message: 'Invalid JSON format in request body',
        },
      ],
    });
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.issues?.length ? { issues: err.issues } : {}),
    });
  }

  // Prisma errors
  if (err.code === 'P2025') {
    return res.status(404).json({ status: 'error', message: 'Resource not found' });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ status: 'error', message: 'Unique constraint violation' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ status: 'error', message: 'Foreign key constraint failed' });
  }

  logger.error({ err }, 'Unhandled application error');

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
