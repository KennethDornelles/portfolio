import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../../database/prisma.service';
import { Project } from './entities/project.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return await this.prisma.project.create({
      data: createProjectDto,
    });
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Project> | Project[]> {
    if (!paginationDto) {
      return await this.prisma.project.findMany({
        orderBy: { order: 'asc' },
      });
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: limit,
        orderBy: { order: 'asc' },
      }),
      this.prisma.project.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findFeatured(): Promise<Project[]> {
    return await this.prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string): Promise<Project> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.project.delete({
      where: { id },
    });
  }
}
