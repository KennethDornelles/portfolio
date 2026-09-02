import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, User, UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { IRefreshTokenRepository } from './repositories/refresh-token.repository.interface';
import { UsersService } from '../users/users.service';

const NOW = new Date('2026-08-31T12:00:00.000Z');
const anyString = {
  asymmetricMatch: (value: unknown): boolean => typeof value === 'string',
  toString: (): string => 'String',
};

const user: User = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'admin@example.com',
  passwordHash: 'hash',
  role: UserRole.ADMIN,
  isActive: true,
  deletedAt: null,
  createdAt: NOW,
  updatedAt: NOW,
};

const tokenRecord: RefreshToken = {
  id: '22222222-2222-4222-8222-222222222222',
  token: 'current-refresh-token',
  userId: user.id,
  ipAddress: null,
  userAgent: null,
  expiresAt: new Date('2026-09-01T12:00:00.000Z'),
  revokedAt: null,
  createdAt: NOW,
};

describe('AuthService refresh rotation', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'findById' | 'findByEmail'>>;
  let repository: jest.Mocked<IRefreshTokenRepository>;
  let rotateMock: jest.Mock;
  let updateManyMock: jest.Mock;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);

    usersService = {
      findById: jest.fn().mockResolvedValue(user),
      findByEmail: jest.fn(),
    };
    repository = {
      create: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(tokenRecord),
      update: jest.fn(),
      updateMany: jest.fn(),
      rotate: jest.fn().mockResolvedValue(true),
    };
    rotateMock = jest.spyOn(repository, 'rotate');
    updateManyMock = jest.spyOn(repository, 'updateMany');
    jwtService = {
      signAsync: jest
        .fn()
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token'),
    };
    const configService = {
      getOrThrow: jest.fn((name: string) => `${name}-value-with-32-characters`),
      get: jest.fn((_name: string, fallback: string) => fallback),
    };

    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
      configService as unknown as ConfigService,
      repository,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('uses the active persisted user role in both renewed tokens', async () => {
    await expect(
      service.refreshTokens(user.id, tokenRecord.token),
    ).resolves.toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    expect(usersService.findById).toHaveBeenCalledWith(user.id);
    expect(jwtService.signAsync).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ sub: user.id, role: UserRole.ADMIN }),
      expect.objectContaining({ expiresIn: '15m' }),
    );
    expect(jwtService.signAsync).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        sub: user.id,
        role: UserRole.ADMIN,
        jti: anyString,
      }),
      expect.objectContaining({ expiresIn: '7d' }),
    );
    expect(rotateMock).toHaveBeenCalledWith(
      tokenRecord.id,
      expect.objectContaining({
        token: 'new-refresh-token',
        userId: user.id,
        expiresAt: new Date('2026-09-07T12:00:00.000Z'),
      }),
      NOW,
    );
  });

  it('rejects a refresh token that is not owned by the JWT subject', async () => {
    await expect(
      service.refreshTokens(
        '33333333-3333-4333-8333-333333333333',
        tokenRecord.token,
      ),
    ).rejects.toThrow('Access denied');

    expect(usersService.findById).not.toHaveBeenCalled();
    expect(rotateMock).not.toHaveBeenCalled();
  });

  it('rejects a disabled user and revokes all active sessions', async () => {
    usersService.findById.mockResolvedValue({ ...user, isActive: false });

    await expect(
      service.refreshTokens(user.id, tokenRecord.token),
    ).rejects.toThrow('Access denied');

    expect(updateManyMock).toHaveBeenCalledWith(
      { userId: user.id, revokedAt: null },
      { revokedAt: NOW },
    );
    expect(rotateMock).not.toHaveBeenCalled();
  });

  it('detects reuse and revokes all remaining active sessions', async () => {
    repository.findUnique.mockResolvedValue({
      ...tokenRecord,
      revokedAt: new Date('2026-08-31T11:59:00.000Z'),
    });

    await expect(
      service.refreshTokens(user.id, tokenRecord.token),
    ).rejects.toThrow('Access denied');

    expect(updateManyMock).toHaveBeenCalledWith(
      { userId: user.id, revokedAt: null },
      { revokedAt: NOW },
    );
  });

  it('rejects an expired token without attempting rotation', async () => {
    repository.findUnique.mockResolvedValue({
      ...tokenRecord,
      expiresAt: NOW,
    });

    await expect(
      service.refreshTokens(user.id, tokenRecord.token),
    ).rejects.toThrow('Access denied');

    expect(rotateMock).not.toHaveBeenCalled();
  });

  it('treats a lost atomic rotation race as reuse', async () => {
    repository.rotate.mockResolvedValue(false);

    await expect(
      service.refreshTokens(user.id, tokenRecord.token),
    ).rejects.toThrow('Access denied');

    expect(updateManyMock).toHaveBeenCalledWith(
      { userId: user.id, revokedAt: null },
      { revokedAt: NOW },
    );
  });

  it('creates distinct refresh payloads even within the same second', async () => {
    jwtService.signAsync.mockReset();
    jwtService.signAsync.mockResolvedValue('signed-token');
    repository.create.mockResolvedValue(tokenRecord);

    await service.login(user);
    await service.login(user);

    const firstRefreshPayload = jwtService.signAsync.mock.calls[1][0] as {
      jti?: string;
    };
    const secondRefreshPayload = jwtService.signAsync.mock.calls[3][0] as {
      jti?: string;
    };
    expect(firstRefreshPayload).toEqual(
      expect.objectContaining({
        jti: anyString,
      }),
    );
    expect(secondRefreshPayload).toEqual(
      expect.objectContaining({
        jti: anyString,
      }),
    );
    expect(firstRefreshPayload.jti).not.toBe(secondRefreshPayload.jti);
  });
});
