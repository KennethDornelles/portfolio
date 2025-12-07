import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../../database/prisma.service';
import { Service } from './entities/service.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return await this.prisma.service.create({
      data: createServiceDto,
    });
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<Service> | Service[]> {
    if (!paginationDto) {
      return await this.prisma.service.findMany({
        orderBy: { order: 'asc' },
      });
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        skip,
        take: limit,
        orderBy: { order: 'asc' },
      }),
      this.prisma.service.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findActive(): Promise<Service[]> {
    return await this.prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: string): Promise<Service> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.service.delete({
      where: { id },
    });
  }
}
