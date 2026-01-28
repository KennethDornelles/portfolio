import { Translation } from '@prisma/client';

export interface II18nRepository {
  findTranslation(language: string, key: string): Promise<Translation | null>;
  findAllByLang(language: string): Promise<Translation[]>;
  count(): Promise<number>;
}
