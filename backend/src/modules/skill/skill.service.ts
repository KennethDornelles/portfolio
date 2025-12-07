import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from '../../database/prisma.service';
import { Skill } from './entities/skill.entity';
import { SkillCategory } from '@prisma/client';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    return await this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<Skill> | Skill[]> {
    if (!paginationDto) {
      return await this.prisma.skill.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      });
    }

    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.skill.findMany({
        skip,
        take: limit,
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      }),
      this.prisma.skill.count(),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findByCategory(category: SkillCategory): Promise<Skill[]> {
    return await this.prisma.skill.findMany({
      where: { category },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.skill.update({
      where: { id },
      data: updateSkillDto,
    });
  }

  async remove(id: string): Promise<Skill> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.skill.delete({
      where: { id },
    });
  }
}
