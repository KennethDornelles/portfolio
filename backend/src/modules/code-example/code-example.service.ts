import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCodeExampleDto } from './dto/create-code-example.dto';
import { UpdateCodeExampleDto } from './dto/update-code-example.dto';
import { PrismaService } from '../../database/prisma.service';
import { CodeExample } from './entities/code-example.entity';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class CodeExampleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCodeExampleDto: CreateCodeExampleDto,
  ): Promise<CodeExample> {
    return await this.prisma.codeExample.create({
      data: createCodeExampleDto,
    });
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResponseDto<CodeExample> | CodeExample[]> {
    if (!paginationDto) {
      return await this.prisma.codeExample.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.codeExample.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.codeExample.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findActive(): Promise<CodeExample[]> {
    return await this.prisma.codeExample.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLanguage(language: string): Promise<CodeExample[]> {
    return await this.prisma.codeExample.findMany({
      where: { language },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<CodeExample> {
    const codeExample = await this.prisma.codeExample.findUnique({
      where: { id },
    });

    if (!codeExample) {
      throw new NotFoundException(`Code example with ID ${id} not found`);
    }

    return codeExample;
  }

  async update(
    id: string,
    updateCodeExampleDto: UpdateCodeExampleDto,
  ): Promise<CodeExample> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.codeExample.update({
      where: { id },
      data: updateCodeExampleDto,
    });
  }

  async remove(id: string): Promise<CodeExample> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.codeExample.delete({
      where: { id },
    });
  }
}
