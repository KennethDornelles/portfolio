import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ITechnologiesRepository } from './technologies.repository.interface';
import { Technology, Prisma } from '@prisma/client';

@Injectable()
export class PrismaTechnologiesRepository implements ITechnologiesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TechnologyCreateInput): Promise<Technology> {
    return this.prisma.technology.create({ data });
  }

  async findAll(): Promise<Technology[]> {
    return this.prisma.technology.findMany();
  }

  async findById(id: string): Promise<Technology | null> {
    return this.prisma.technology.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Technology | null> {
    return this.prisma.technology.findUnique({ where: { name } });
  }

  async update(id: string, data: Prisma.TechnologyUpdateInput): Promise<Technology> {
    return this.prisma.technology.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Technology> {
    return this.prisma.technology.delete({ where: { id } });
  }
}
