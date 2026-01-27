import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { II18nRepository } from './repositories/i18n.repository.interface';

@Injectable()
export class I18nService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: any,
    private i18nRepository: II18nRepository,
  ) {}

  async getTranslation(key: string, lang: string = 'PT_BR'): Promise<string> {
    const cacheKey = `i18n:${lang}:${key}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) return cached;

    const record = await this.i18nRepository.findTranslation(lang, key);

    const value = record?.value || key;
    
    // Cache for 1 hour
    await this.cacheManager.set(cacheKey, value, 3600000);

    return value;
  }
}
