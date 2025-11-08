import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { PrismaService } from '../../database/prisma.service';
import { Education } from './entities/education.entity';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEducationDto: CreateEducationDto): Promise<Education> {
    return await this.prisma.education.create({
      data: createEducationDto,
    });
  }

  async findAll(): Promise<Education[]> {
    return await this.prisma.education.findMany({
      orderBy: { order: 'asc' },
    });
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
