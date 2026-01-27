import { Profile, Prisma } from '@prisma/client';

export abstract class IProfileRepository {
  abstract create(data: Prisma.ProfileUncheckedCreateInput): Promise<Profile>;
  abstract update(userId: string, data: Prisma.ProfileUpdateInput): Promise<Profile>;
  abstract findByUserId(userId: string): Promise<Profile | null>;
}
