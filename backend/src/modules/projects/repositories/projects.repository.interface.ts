import { Project, Technology, Prisma } from '@prisma/client';

export abstract class IProjectsRepository {
  abstract create(data: Prisma.ProjectCreateInput): Promise<Project>;
  abstract update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project>;
  abstract delete(id: string): Promise<Project>;
  abstract findAll(): Promise<Project[]>;
  abstract findById(id: string): Promise<Project | null>;
  abstract findBySlug(slug: string): Promise<Project | null>;
}
