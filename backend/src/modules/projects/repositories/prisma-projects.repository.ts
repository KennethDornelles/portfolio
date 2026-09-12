import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IProjectsRepository } from './projects.repository.interface';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class PrismaProjectsRepository implements IProjectsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({
      data,
      include: { technologies: true },
    });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
      include: { technologies: true },
    });
  }

  async delete(id: string): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      include: { technologies: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPage(
    page: number,
    limit: number,
  ): Promise<{ items: Project[]; total: number }> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        include: { technologies: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.project.count(),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: { technologies: true },
    });
  }

  async findBySlug(slug: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { slug },
      include: { technologies: true },
    });
  }
}
