import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming PrismaService is in 'common/prisma' or similar, checking previous file list
// Wait, I saw 'prisma' module in 'backend/src/modules/prisma'. Let me check imports in other services.
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  create(createExperienceDto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: createExperienceDto,
    });
  }

  findAll() {
    return this.prisma.experience.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.experience.findUnique({
      where: { id },
    });
  }

  update(id: string, updateExperienceDto: UpdateExperienceDto) {
    return this.prisma.experience.update({
      where: { id },
      data: updateExperienceDto,
    });
  }

  remove(id: string) {
    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
