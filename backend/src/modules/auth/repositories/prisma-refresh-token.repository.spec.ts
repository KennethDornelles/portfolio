import { PrismaService } from '../../prisma/prisma.service';
import { PrismaRefreshTokenRepository } from './prisma-refresh-token.repository';

const NOW = new Date('2026-08-31T12:00:00.000Z');
const newTokenData = {
  token: 'new-refresh-token',
  userId: '11111111-1111-4111-8111-111111111111',
  expiresAt: new Date('2026-09-07T12:00:00.000Z'),
};

describe('PrismaRefreshTokenRepository.rotate', () => {
  it('consumes and creates the replacement in one transaction', async () => {
    const transaction = {
      refreshToken: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        create: jest.fn().mockResolvedValue({}),
      },
    };
    const prisma = {
      $transaction: jest.fn(
        async (operation: (client: typeof transaction) => Promise<boolean>) =>
          operation(transaction),
      ),
    };
    const repository = new PrismaRefreshTokenRepository(
      prisma as unknown as PrismaService,
    );

    await expect(
      repository.rotate('old-token-id', newTokenData, NOW),
    ).resolves.toBe(true);
    expect(transaction.refreshToken.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'old-token-id',
        revokedAt: null,
        expiresAt: { gt: NOW },
      },
      data: { revokedAt: NOW },
    });
    expect(transaction.refreshToken.create).toHaveBeenCalledWith({
      data: newTokenData,
    });
  });

  it('does not create a replacement when another request consumed the token', async () => {
    const transaction = {
      refreshToken: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn(
        async (operation: (client: typeof transaction) => Promise<boolean>) =>
          operation(transaction),
      ),
    };
    const repository = new PrismaRefreshTokenRepository(
      prisma as unknown as PrismaService,
    );

    await expect(
      repository.rotate('old-token-id', newTokenData, NOW),
    ).resolves.toBe(false);
    expect(transaction.refreshToken.create).not.toHaveBeenCalled();
  });
});
