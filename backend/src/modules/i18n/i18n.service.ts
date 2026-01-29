import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { createClient } from 'redis';
import { II18nRepository } from './repositories/i18n.repository.interface';

@Injectable()
export class I18nService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: any,
    private i18nRepository: II18nRepository,
  ) {}

  async getTranslation(key: string, lang: string = 'PT_BR'): Promise<string> {
    const cacheKey = `i18n:${lang}:${key}`;
    try {
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) return cached as string;
    } catch (e) {
      console.warn(`Redis Cache Error (getTranslation): ${e instanceof Error ? e.message : e}`);
    }

    const record = await this.i18nRepository.findTranslation(lang, key);

    const value = record?.value || key;
    
    // Cache for 1 hour
    try {
      await this.cacheManager.set(cacheKey, value, 3600000);
    } catch (e) {
       console.warn(`Redis Cache Set Error: ${e instanceof Error ? e.message : e}`);
    }

    return value;
  }

  async getTranslations(lang: string = 'PT_BR'): Promise<Record<string, string>> {
    const cacheKey = `i18n:all:${lang}`;
    
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
      await this.cacheManager.set(cacheKey, map, 3600000);
    } catch (e) {
       console.warn(`Redis Cache Set Error: ${e instanceof Error ? e.message : e}`);
    }
    return map;
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
        return {
            totalTranslations: count,
            sampleNavHome: sample,
            connection: 'Active'
        };
    } catch (e) {
        return {
            error: e instanceof Error ? e.message : String(e),
            connection: 'Failed'
        };
    }
  }
}
