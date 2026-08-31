import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  II18nRepository,
  TranslationWithKey,
} from './i18n.repository.interface';
import { LanguageCode, Translation } from '@prisma/client';

@Injectable()
export class PrismaI18nRepository implements II18nRepository {
  constructor(private prisma: PrismaService) {}

  async findTranslation(
    language: LanguageCode,
    key: string,
  ): Promise<Translation | null> {
    return this.prisma.translation.findFirst({
      where: {
        language,
        translationKey: { key },
      },
    });
  }

  async findAllByLang(language: LanguageCode): Promise<TranslationWithKey[]> {
    return this.prisma.translation.findMany({
      where: {
        language,
      },
      include: {
        translationKey: true,
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.translation.count();
  }
}
