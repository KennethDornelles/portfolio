import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersService } from './users.service';
import { IUsersRepository } from './repositories/users.repository.interface';

describe('UsersService', () => {
  it('maps a duplicate email constraint to ConflictException', async () => {
    const repository = {
      create: jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('unique email', {
          code: 'P2002',
          clientVersion: '6.19.3',
        }),
      ),
    } as unknown as IUsersRepository;
    const service = new UsersService(repository);

    await expect(
      service.create({
        email: 'User@Example.com',
        passwordHash: 'password123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
