import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { RtStrategy } from './rt.strategy';

describe('RtStrategy payload mapping', () => {
  const strategy = Object.create(RtStrategy.prototype) as RtStrategy;
  const payload = {
    sub: '11111111-1111-4111-8111-111111111111',
    role: UserRole.ADMIN,
    iat: 1_788_177_600,
    jti: 'event-id',
  };

  it('maps the JWT subject to the userId consumed by the controller', () => {
    const request = {
      get: jest.fn().mockReturnValue('Bearer current-refresh-token'),
    } as unknown as Request;

    expect(strategy.validate(request, payload)).toEqual({
      userId: payload.sub,
      role: UserRole.ADMIN,
      refreshToken: 'current-refresh-token',
    });
  });

  it('rejects a request without a bearer token', () => {
    const request = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Request;

    expect(() => strategy.validate(request, payload)).toThrow(
      ForbiddenException,
    );
  });
});
