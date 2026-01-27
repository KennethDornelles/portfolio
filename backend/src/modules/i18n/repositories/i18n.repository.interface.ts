import { Translation, Prisma } from '@prisma/client';

export abstract class II18nRepository {
  abstract findTranslation(language: string, key: string): Promise<Translation | null>;
}
