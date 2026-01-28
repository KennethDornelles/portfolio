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
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) return cached;

    const record = await this.i18nRepository.findTranslation(lang, key);

    const value = record?.value || key;
    
    // Cache for 1 hour
    await this.cacheManager.set(cacheKey, value, 3600000);

    return value;
  }

  async getTranslations(lang: string = 'PT_BR'): Promise<Record<string, string>> {
    const cacheKey = `i18n:all:${lang}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) return cached as Record<string, string>;

    const records = await this.i18nRepository.findAllByLang(lang);
    
    // Transform to Key-Value map
    const map: Record<string, string> = {};
    records.forEach(r => {
        // We assume the joined translationKey is available or we use the key directly if stored in Translation?
        // In the schema: Translation has keyId, TranslationKey has key.
        // The repository include: { translationKey: true } should be added to interface return type or casted.
        // Actually, Prisma types include relations if included.
        // Let's assume Translation type has translationKey property available at runtime if included.
        // However, TS might complain if I don't use the generated type with relation.
        // For simplicity, I'll use any or careful casting.
        // Wait, Translation type from @prisma/client does NOT have relations.
        // I should just use (r as any).translationKey.key
        const key = (r as any).translationKey?.key;
        if (key) {
            map[key] = r.value;
        }
    });

    await this.cacheManager.set(cacheKey, map, 3600000);
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
}
