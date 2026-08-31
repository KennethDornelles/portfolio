import {
  Injectable,
  Inject,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { II18nRepository } from './repositories/i18n.repository.interface';
import { getI18nRedisStore } from './i18n-redis-store';

@Injectable()
export class I18nService implements OnModuleInit {
  private readonly logger = new Logger(I18nService.name);
  private cacheVersion: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private i18nRepository: II18nRepository,
  ) {
    this.cacheVersion = 'v1'; // Static version to avoid Cache Stampede on deploy
  }

  async onModuleInit() {
    this.logger.log(
      `Starting i18n cache warm-up (Version: ${this.cacheVersion})`,
    );
    await this.warmupCache();
    this.logger.log('I18n cache warmed up successfully');
  }

  private getCacheKey(key: string, lang: string): string {
    return `i18n:v${this.cacheVersion}:${lang}:${key}`;
  }

  private getAllCacheKey(lang: string): string {
    return `i18n:v${this.cacheVersion}:all:${lang}`;
  }

  private async warmupCache() {
    // Pre-load translations for all supported languages
    for (const lang of ['PT_BR', 'EN_US']) {
      await this.getTranslations(lang);
    }
  }

  async getTranslation(key: string, lang: string = 'PT_BR'): Promise<string> {
    const cacheKey = this.getCacheKey(key, lang);
    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) return cached as string;
    } catch {
      this.logger.warn('I18n cache read failed');
    }

    const record = await this.i18nRepository.findTranslation(lang, key);

    const value = record?.value || key;

    // Cache for 24 hours (86400000 ms)
    try {
      await this.cacheManager.set(cacheKey, value, 86400000);
    } catch {
      this.logger.warn('I18n cache write failed');
    }

    return value;
  }

  async getTranslations(
    lang: string = 'PT_BR',
  ): Promise<Record<string, string>> {
    const cacheKey = this.getAllCacheKey(lang);

    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) return cached as Record<string, string>;
    } catch {
      this.logger.warn('I18n cache read failed');
    }

    const records = await this.i18nRepository.findAllByLang(lang);

    this.logger.debug(`Loaded ${records.length} translations for ${lang}`);

    // Transform to Key-Value map
    const map: Record<string, string> = {};
    records.forEach((r) => {
      if (!r) return;

      const key = r.translationKey?.key;
      if (key) {
        map[key] = r.value;
      } else {
        this.logger.warn('Translation record is missing its key relation');
      }
    });

    try {
      // Cache for 24 hours (86400000 ms)
      await this.cacheManager.set(cacheKey, map, 86400000);
    } catch {
      this.logger.warn('I18n cache write failed');
    }
    return map;
  }

  async refreshCache() {
    this.logger.log('Refreshing i18n cache');
    const result = await this.clearCache();
    if (!result.success) {
      throw new ServiceUnavailableException('I18n cache operation failed');
    }
    await this.warmupCache();
    this.logger.log('I18n cache refreshed successfully');
  }

  async clearCache() {
    try {
      const store = getI18nRedisStore(this.cacheManager);
      if (!store) {
        throw new Error('Redis store unavailable');
      }

      const keys = await store.client.keys('i18n:*');
      if (keys.length > 0) {
        await store.client.del(keys);
      }
      return { success: true };
    } catch {
      this.logger.error('I18n cache clear failed');
      return { success: false };
    }
  }

  async getCacheHealth(): Promise<{ status: 'up' }> {
    try {
      await this.i18nRepository.count();
      await this.cacheManager.get(this.getAllCacheKey('PT_BR'));
      return { status: 'up' };
    } catch {
      this.logger.error('I18n cache diagnostics failed');
      throw new ServiceUnavailableException(
        'I18n cache diagnostics unavailable',
      );
    }
  }
}
