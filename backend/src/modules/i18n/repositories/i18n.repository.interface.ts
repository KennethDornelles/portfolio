import { Translation } from '@prisma/client';

export type TranslationWithKey = Translation & {
  translationKey: { key: string };
};

export abstract class II18nRepository {
  abstract findTranslation(
    language: string,
    key: string,
  ): Promise<Translation | null>;
  abstract findAllByLang(language: string): Promise<TranslationWithKey[]>;
  abstract count(): Promise<number>;
}
