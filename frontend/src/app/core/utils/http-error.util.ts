import { HttpErrorResponse } from '@angular/common/http';

export function getHttpErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse) || error.status < 400 || error.status >= 500) {
    return fallback;
  }

  const message: unknown = error.error?.message;
  if (Array.isArray(message)) {
    return message.filter((item): item is string => typeof item === 'string').join('; ') || fallback;
  }

  return typeof message === 'string' && message.trim() ? message : fallback;
}
