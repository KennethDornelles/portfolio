import { Injectable, NotFoundException } from '@nestjs/common';
import { IProjectsRepository } from './repositories/projects.repository.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private projectsRepository: IProjectsRepository) {}

  async create(createProjectDto: CreateProjectDto) {
    const { technologyIds, ...data } = createProjectDto;
    
    return this.projectsRepository.create({
      ...data,
      technologies: technologyIds ? {
        connect: technologyIds.map(id => ({ id })),
      } : undefined,
    });
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
