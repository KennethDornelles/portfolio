import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IProjectsRepository } from './repositories/projects.repository.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { projectCacheKeys } from './project-cache.keys';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsRepository: IProjectsRepository,
    @Inject(CACHE_MANAGER) private cache: { del(key: string): Promise<void> },
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const { technologyIds, ...data } = createProjectDto;

      // Check if slug already exists
      const existing = await this.projectsRepository.findBySlug(data.slug);
      if (existing) {
        throw new ConflictException(
          `Project with slug "${data.slug}" already exists`,
        );
      }

      const project = await this.projectsRepository.create({
        ...data,
        technologies: technologyIds
          ? {
              connect: technologyIds.map((id) => ({ id })),
            }
          : undefined,
      });
      await this.invalidateProjectCaches(project.id, project.slug);
      return project;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('❌ ProjectsService.create failed:', error);
      throw error;
    }
  }

  async findAll() {
    return this.projectsRepository.findAll();
  }

  async findOne(id: string) {
    const project = await this.projectsRepository.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findBySlug(slug: string) {
    const project = await this.projectsRepository.findBySlug(slug);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const existing = await this.projectsRepository.findById(id);
    if (!existing) throw new NotFoundException('Project not found');
    const { technologyIds, ...data } = updateProjectDto;
    try {
      const project = await this.projectsRepository.update(id, {
        ...data,
        technologies: technologyIds
          ? { set: technologyIds.map((technologyId) => ({ id: technologyId })) }
          : undefined,
      });
      await this.invalidateProjectCaches(
        project.id,
        existing.slug,
        project.slug,
      );
      return project;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.projectsRepository.findById(id);
      if (!existing) throw new NotFoundException('Project not found');
      const project = await this.projectsRepository.delete(id);
      await this.invalidateProjectCaches(project.id, existing.slug);
      return project;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  private async invalidateProjectCaches(id: string, ...slugs: string[]) {
    const keys = new Set([
      projectCacheKeys.list,
      projectCacheKeys.byId(id),
      ...slugs.filter(Boolean).map((slug) => projectCacheKeys.bySlug(slug)),
    ]);
    await Promise.all([...keys].map((key) => this.cache.del(key)));
  }
}
