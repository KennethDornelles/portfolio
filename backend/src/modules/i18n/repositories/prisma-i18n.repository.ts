import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { II18nRepository } from './i18n.repository.interface';
import { Translation } from '@prisma/client';

@Injectable()
export class PrismaI18nRepository implements II18nRepository {
  constructor(private prisma: PrismaService) {}

  async findTranslation(language: string, key: string): Promise<Translation | null> {
    return this.prisma.translation.findFirst({
      where: {
        language: language === 'PT_BR' ? 'PT_BR' : 'EN_US',
        translationKey: { key },
      },
    });
  }

  async findAllByLang(language: string): Promise<Translation[]> {
    return this.prisma.translation.findMany({
      where: {
        language: language === 'PT_BR' ? 'PT_BR' : 'EN_US',
      },
      include: {
        translationKey: true,
      },
    });
  }
}
