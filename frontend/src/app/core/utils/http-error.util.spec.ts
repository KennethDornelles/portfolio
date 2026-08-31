import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { getHttpErrorMessage } from './http-error.util';

describe('getHttpErrorMessage', () => {
  it('returns a controlled 4xx message', () => {
    const error = new HttpErrorResponse({
      status: 409,
      error: { message: 'Resource already exists' },
    });

    expect(getHttpErrorMessage(error, 'Fallback')).toBe('Resource already exists');
  });

  it('joins validation messages', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { message: ['email must be valid', 'password is too short'] },
    });

    expect(getHttpErrorMessage(error, 'Fallback')).toBe(
      'email must be valid; password is too short',
    );
  });

  it('does not expose server error details', () => {
    const error = new HttpErrorResponse({
      status: 500,
      error: { message: 'Internal database detail' },
    });

    expect(getHttpErrorMessage(error, 'Safe fallback')).toBe('Safe fallback');
  });
});
