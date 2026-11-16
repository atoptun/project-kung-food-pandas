import type { ApiErrorResponse } from '@repo/shared';
import { isAxiosError } from 'axios';

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string' &&
    value.message.length > 0
  );
}

/** Human-readable message from an axios (`ApiErrorResponse`), Better Auth or plain error. */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message || FALLBACK_MESSAGE;
  }

  if (hasMessage(error)) {
    return error.message;
  }

  return FALLBACK_MESSAGE;
}
