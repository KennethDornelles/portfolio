import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { PrismaService } from '../../database/prisma.service';
import { Experience } from './entities/experience.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    return await this.prisma.experience.create({
      data: createExperienceDto,
    });
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Experience> | Experience[]> {
    if (!paginationDto) {
      return await this.prisma.experience.findMany({
        orderBy: { order: 'asc' },
      });
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.experience.findMany({
        skip,
        take: limit,
        orderBy: { order: 'asc' },
      }),
      this.prisma.experience.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findCurrent(): Promise<Experience[]> {
    return await this.prisma.experience.findMany({
      where: { current: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string): Promise<Experience> {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return experience;
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<Experience> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.experience.update({
      where: { id },
      data: updateExperienceDto,
    });
  }

  async remove(id: string): Promise<Experience> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.experience.delete({
      where: { id },
    });
  }
}
