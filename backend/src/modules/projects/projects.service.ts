import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IProjectsRepository } from './repositories/projects.repository.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private projectsRepository: IProjectsRepository) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const { technologyIds, ...data } = createProjectDto;
      
      // Check if slug already exists
      const existing = await this.projectsRepository.findBySlug(data.slug);
      if (existing) {
        throw new ConflictException(`Project with slug "${data.slug}" already exists`);
      }

      return await this.projectsRepository.create({
        ...data,
        technologies: technologyIds ? {
          connect: technologyIds.map(id => ({ id })),
        } : undefined,
      });
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
    const { technologyIds, ...data } = updateProjectDto;

    return this.projectsRepository.update(id, {
      ...data,
      technologies: technologyIds ? {
        set: technologyIds.map(id => ({ id })), // Replaces existing connections
      } : undefined,
    });
  }

  async remove(id: string) {
    return this.projectsRepository.delete(id);
  }
}
