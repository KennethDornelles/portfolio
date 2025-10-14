import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreatePersonalInfoDto } from './dto/create-personal-info.dto';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { PrismaService } from '../../database/prisma.service';
import { PersonalInfo } from './entities/personal-info.entity';

@Injectable()
export class PersonalInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPersonalInfoDto: CreatePersonalInfoDto,
  ): Promise<PersonalInfo> {
    // Verificar se já existe um registro (singleton)
    const existing = await this.prisma.personalInfo.findFirst();
    if (existing) {
      throw new ConflictException(
        'Personal info already exists. Use update instead.',
      );
    }

    return this.prisma.personalInfo.create({
      data: createPersonalInfoDto,
    });
  }

  async findAll(): Promise<PersonalInfo[]> {
    return await this.prisma.personalInfo.findMany();
  }

  async findOne(id: string): Promise<PersonalInfo> {
    const personalInfo = await this.prisma.personalInfo.findUnique({
      where: { id },
    });

    if (!personalInfo) {
      throw new NotFoundException(`Personal info with ID ${id} not found`);
    }

    return personalInfo;
  }

  async findCurrent(): Promise<PersonalInfo | null> {
    // Retorna o primeiro (e único) registro de informações pessoais
    return await this.prisma.personalInfo.findFirst();
  }

  async update(
    id: string,
    updatePersonalInfoDto: UpdatePersonalInfoDto,
  ): Promise<PersonalInfo> {
    await this.findOne(id); // Verifica se existe

    return this.prisma.personalInfo.update({
      where: { id },
      data: updatePersonalInfoDto,
    });
  }

  async remove(id: string): Promise<PersonalInfo> {
    await this.findOne(id); // Verifica se existe

    return this.prisma.personalInfo.delete({
      where: { id },
    });
  }
}
