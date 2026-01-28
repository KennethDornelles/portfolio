import { Technology, Prisma } from '@prisma/client';

export interface ITechnologiesRepository {
  create(data: Prisma.TechnologyCreateInput): Promise<Technology>;
  findAll(): Promise<Technology[]>;
  findById(id: string): Promise<Technology | null>;
  findByName(name: string): Promise<Technology | null>;
  update(id: string, data: Prisma.TechnologyUpdateInput): Promise<Technology>;
  delete(id: string): Promise<Technology>;
}
