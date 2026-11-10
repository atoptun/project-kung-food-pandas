import type { NextFunction, Request, Response } from 'express';
import type { z, ZodError } from 'zod';

import { BadRequestError, type ErrorIssue, UnprocessableEntityError } from '@/errors/http.error';

function formatZodIssues(error: ZodError): ErrorIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

export const validateBody =
  <T extends z.ZodType>(schema: T) =>
  (
    req: Request<Record<string, string>, unknown, z.infer<T>>,
    _res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new UnprocessableEntityError('Validation failed', formatZodIssues(result.error)));
    }
    req.body = result.data;
    next();
  };

export const validateParams =
  <T extends z.ZodType>(schema: T) =>
  (req: Request<z.infer<T>>, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(new BadRequestError('Invalid parameters', formatZodIssues(result.error)));
    }
    req.params = result.data;
    next();
  };

export const validateQuery =
  <T extends z.ZodType>(schema: T) =>
  (req: Request, res: Response<unknown, { query: z.infer<T> }>, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new BadRequestError('Invalid query parameters', formatZodIssues(result.error)));
    }
    res.locals.query = result.data;
    next();
  };
