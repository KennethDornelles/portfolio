import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { PrismaService } from '../../database/prisma.service';
import { Education } from './entities/education.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEducationDto: CreateEducationDto): Promise<Education> {
    return await this.prisma.education.create({
      data: createEducationDto,
    });
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<Education> | Education[]> {
    if (!paginationDto) {
      return await this.prisma.education.findMany({
        orderBy: { order: 'asc' },
      });
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.education.findMany({
        skip,
        take: limit,
        orderBy: { order: 'asc' },
      }),
      this.prisma.education.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findCurrent(): Promise<Education[]> {
    return await this.prisma.education.findMany({
      where: { current: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string): Promise<Education> {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    return education;
  }

  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
  ): Promise<Education> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.education.update({
      where: { id },
      data: updateEducationDto,
    });
  }

  async remove(id: string): Promise<Education> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.education.delete({
      where: { id },
    });
  }
}
