import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from '../../database/prisma.service';
import { Skill } from './entities/skill.entity';
import { SkillCategory } from '@prisma/client';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    return await this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async findAll(): Promise<Skill[]> {
    return await this.prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
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
