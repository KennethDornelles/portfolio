import { KeyvAdapter, type Cache, type CacheManagerStore } from 'cache-manager';

export interface I18nRedisClient {
  set(
    key: string,
    value: string,
    options: { NX: true; PX: number },
  ): Promise<string | null>;
  keys(pattern: string): Promise<string[]>;
  del(keys: string[]): Promise<number>;
}

export interface I18nRedisStore {
  client: I18nRedisClient;
}

export class I18nRedisKeyvAdapter extends KeyvAdapter {
  constructor(private readonly redisStore: I18nRedisStore) {
    super(redisStore as unknown as CacheManagerStore);
  }

  get client(): I18nRedisClient {
    return this.redisStore.client;
  }
}

export function getI18nRedisStore(
  cacheManager: Cache,
): I18nRedisStore | undefined {
  const keyvStore = cacheManager.stores?.[0]?.store as
    Partial<I18nRedisStore> | undefined;
  return keyvStore?.client ? (keyvStore as I18nRedisStore) : undefined;
}
