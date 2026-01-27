import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IProfileRepository } from './profile.repository.interface';
import { Prisma, Profile } from '@prisma/client';

@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProfileUncheckedCreateInput): Promise<Profile> {
    return this.prisma.profile.create({
      data,
    });
  }

  async update(userId: string, data: Prisma.ProfileUpdateInput): Promise<Profile> {
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }
}
