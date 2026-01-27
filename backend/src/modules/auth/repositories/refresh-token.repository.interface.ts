import { RefreshToken, Prisma } from '@prisma/client';

export abstract class IRefreshTokenRepository {
  abstract create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken>;
  abstract findUnique(token: string): Promise<RefreshToken | null>;
  abstract update(id: string, data: Prisma.RefreshTokenUpdateInput): Promise<RefreshToken>;
  abstract updateMany(where: Prisma.RefreshTokenWhereInput, data: Prisma.RefreshTokenUpdateInput): Promise<Prisma.BatchPayload>;
  abstract rotate(oldId: string, newData: Prisma.RefreshTokenUncheckedCreateInput): Promise<void>;
}
