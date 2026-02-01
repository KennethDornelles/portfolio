import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { createClient } from 'redis';
import { II18nRepository } from './repositories/i18n.repository.interface';

@Injectable()
export class I18nService implements OnModuleInit {
  private cacheVersion: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: any,
    private i18nRepository: II18nRepository,
  ) {
    this.cacheVersion = process.env.RENDER_GIT_COMMIT || String(Date.now());
  }

  async onModuleInit() {
    console.log(`🔥 Starting i18n cache warm-up (Version: ${this.cacheVersion})...`);
    await this.warmupCache();
    console.log('✅ i18n cache warmed up successfully');
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
    } catch (e) {
      console.warn(`Redis Cache Error (getTranslation): ${e instanceof Error ? e.message : e}`);
    }

    const record = await this.i18nRepository.findTranslation(lang, key);

    const value = record?.value || key;
    
    // Cache for 24 hours (86400000 ms)
    try {
      await this.cacheManager.set(cacheKey, value, 86400000);
    } catch (e) {
       console.warn(`Redis Cache Set Error: ${e instanceof Error ? e.message : e}`);
    }

    return value;
  }

  async getTranslations(lang: string = 'PT_BR'): Promise<Record<string, string>> {
    const cacheKey = this.getAllCacheKey(lang);
    
    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) return cached as Record<string, string>;
    } catch (e) {
       console.warn(`Redis Cache Error (getTranslations): ${e instanceof Error ? e.message : e}`);
    }

    const records = await this.i18nRepository.findAllByLang(lang);
    
    // Transform to Key-Value map
    const map: Record<string, string> = {};
    records.forEach(r => {
        const key = (r as any).translationKey?.key;
        if (key) {
            map[key] = r.value;
        }
    });

    try {
      // Cache for 24 hours (86400000 ms)
      await this.cacheManager.set(cacheKey, map, 86400000);
    } catch (e) {
       console.warn(`Redis Cache Set Error: ${e instanceof Error ? e.message : e}`);
    }
    return map;
  }

  async refreshCache() {
    console.log('🔄 Refreshing cache triggered...');
    await this.clearCache();
    await this.warmupCache();
    console.log('✅ Cache refreshed successfully');
  }

  async clearCache() {
    console.log('Attempting to clear cache via direct Redis client...');
    let client;
    try {
        // Construct Redis URL from env or use existing REDIS_URL
        const url = process.env.REDIS_URL || 
             (process.env.REDIS_HOST ? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || 6379}` : undefined);

        if (!url) {
            throw new Error('REDIS_URL not found in environment');
        }

        // Handle Render's rediss:// if needed
        const options: any = { url };
        if (url.startsWith('rediss://')) {
            options.socket = {
                tls: true,
                rejectUnauthorized: false 
            };
        }

        client = createClient(options);
        
        client.on('error', err => console.error('Direct Redis Client Error', err));
        
        await client.connect();
        
        // Clear keys for ALL versions to ensure a clean slate on manual clear
        // Or strictly we could clear only current version, but manual clear usually implies "reset everything"
        const keys = await client.keys('i18n:*');
        
        let count = 0;
        if (keys.length > 0) {
            count = await client.del(keys);
        }
        
        return { success: true, method: 'direct-redis-client', keysFound: keys.length, keysDeleted: count };

    } catch (e) {
        console.error('Failed to clear cache', e);
        throw e;
    } finally {
        if (client && client.isOpen) {
            await client.disconnect();
        }
    }
  }

  async debugDB() {
    try {
        const count = await this.i18nRepository.count();
        const sample = await this.i18nRepository.findTranslation('EN_US', 'NAV_HOME');
        
        // Check cache status for current version
        const ptCache = await this.cacheManager.get(this.getAllCacheKey('PT_BR'));
        const enCache = await this.cacheManager.get(this.getAllCacheKey('EN_US'));

        return {
            database: {
              totalTranslations: count,
              sampleNavHome: sample,
              connection: 'Active'
            },
            cache: {
              version: this.cacheVersion,
              PT_BR: {
                count: ptCache ? Object.keys(ptCache).length : 0,
                status: ptCache ? 'populated' : 'empty'
              },
              EN_US: {
                count: enCache ? Object.keys(enCache).length : 0,
                status: enCache ? 'populated' : 'empty'
              }
            }
        };
    } catch (e) {
        return {
            error: e instanceof Error ? e.message : String(e),
            connection: 'Failed'
        };
    }
  }
}
