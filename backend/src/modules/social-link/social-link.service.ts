import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { PrismaService } from '../../database/prisma.service';
import { SocialLink } from './entities/social-link.entity';

@Injectable()
export class SocialLinkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSocialLinkDto: CreateSocialLinkDto): Promise<SocialLink> {
    return await this.prisma.socialLink.create({
      data: createSocialLinkDto,
    });
  }

  async findAll(): Promise<SocialLink[]> {
    return await this.prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findActive(): Promise<SocialLink[]> {
    return await this.prisma.socialLink.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string): Promise<SocialLink> {
    const socialLink = await this.prisma.socialLink.findUnique({
      where: { id },
    });

    if (!socialLink) {
      throw new NotFoundException(`Social link with ID ${id} not found`);
    }

    return socialLink;
  }

  async update(
    id: string,
    updateSocialLinkDto: UpdateSocialLinkDto,
  ): Promise<SocialLink> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.socialLink.update({
      where: { id },
      data: updateSocialLinkDto,
    });
  }

  async remove(id: string): Promise<SocialLink> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.socialLink.delete({
      where: { id },
    });
  }
}
