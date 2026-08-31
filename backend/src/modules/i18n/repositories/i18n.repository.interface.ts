import { LanguageCode, Translation } from '@prisma/client';

export type TranslationWithKey = Translation & {
  translationKey: { key: string };
};

export abstract class II18nRepository {
  abstract findTranslation(
    language: LanguageCode,
    key: string,
  ): Promise<Translation | null>;
  abstract findAllByLang(language: LanguageCode): Promise<TranslationWithKey[]>;
  abstract count(): Promise<number>;
}
