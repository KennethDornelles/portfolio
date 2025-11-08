import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../../database/prisma.service';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return await this.prisma.service.create({
      data: createServiceDto,
    });
  }

  async findAll(): Promise<Service[]> {
    return await this.prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
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
