import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { II18nRepository } from './repositories/i18n.repository.interface';

@Injectable()
export class I18nService implements OnModuleInit {
  private cacheVersion: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: any,
    private i18nRepository: II18nRepository,
  ) {
    this.cacheVersion = 'v1'; // Static version to avoid Cache Stampede on deploy
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
    console.log('Attempting to clear cache...');
    try {
        const store = this.cacheManager?.store as any;
        const client = store?.client || store?.redisClient;
        
        if (client && typeof client.keys === 'function') {
            console.log('Found native Redis client. Executing pattern-delete...');
            const keys = await client.keys('i18n:*');
            
            let count = 0;
            if (Array.isArray(keys) && keys.length > 0) {
                count = await client.del(keys);
            }
            
            return { success: true, method: 'pattern-delete', keysFound: keys?.length || 0, keysDeleted: count };
        }
        
        console.log('Native Redis client not found or unsupported. Falling back to global reset()...');
        
        if (typeof this.cacheManager?.reset === 'function') {
            await this.cacheManager.reset();
            return { success: true, method: 'manager-reset' };
        } else if (store && typeof store.reset === 'function') {
            await store.reset();
            return { success: true, method: 'store-reset' };
        }
        
        throw new Error('No reset mechanism found in CacheManager or underlying Store');

    } catch (e) {
        console.error('Failed to clear cache safely', e);
        return { 
           success: false, 
           message: e instanceof Error ? e.message : String(e) 
        };
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
