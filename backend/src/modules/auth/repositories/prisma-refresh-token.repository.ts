import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IRefreshTokenRepository } from './refresh-token.repository.interface';
import { Prisma, RefreshToken } from '@prisma/client';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  async findUnique(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async update(id: string, data: Prisma.RefreshTokenUpdateInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: { id },
      data,
    });
  }

  async updateMany(where: Prisma.RefreshTokenWhereInput, data: Prisma.RefreshTokenUpdateInput): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.updateMany({
      where,
      data,
    });
  }

  async rotate(oldId: string, newData: Prisma.RefreshTokenUncheckedCreateInput): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: oldId },
        data: { revokedAt: new Date() },
      }),
      this.prisma.refreshToken.create({
        data: newData,
      }),
    ]);
  }
}
