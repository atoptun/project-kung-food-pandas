import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '@/errors/http.error';
import { auth } from '@/lib/auth';

type SessionData = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

declare module 'express' {
  interface Request {
    user?: SessionData['user'];
    session?: SessionData['session'];
  }
}

/** Id of the session user on routes behind `authenticate`. */
export function getAuthUserId(req: Request): string {
  if (!req.user) {
    throw new UnauthorizedError('Not authorized');
  }
  return req.user.id;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return next(new UnauthorizedError('Not authorized'));
  }

  req.user = session.user;
  req.session = session.session;
  next();
}
