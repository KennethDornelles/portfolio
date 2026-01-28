import { Translation, Prisma } from '@prisma/client';

export abstract class II18nRepository {
  abstract findTranslation(language: string, key: string): Promise<Translation | null>;
  abstract findAllByLang(language: string): Promise<Translation[]>;
}
