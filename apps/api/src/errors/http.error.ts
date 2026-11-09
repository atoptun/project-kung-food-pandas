import type { ApiErrorResponse } from '@repo/shared';

export type ErrorIssue = NonNullable<ApiErrorResponse['issues']>[number];

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public issues?: ErrorIssue[],
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', issues?: ErrorIssue[]) {
    super(400, message, issues);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = 'Unprocessable Content', issues?: ErrorIssue[]) {
    super(422, message, issues);
  }
}
