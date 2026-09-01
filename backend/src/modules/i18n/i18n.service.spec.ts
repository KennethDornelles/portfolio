import { LanguageCode } from '@prisma/client';
import { ServiceUnavailableException } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { I18nService } from './i18n.service';
import { II18nRepository } from './repositories/i18n.repository.interface';

describe('I18nService', () => {
  const ptRecords = [
    { value: 'Início', translationKey: { key: 'NAV_HOME' } },
    { value: 'Transformamos', translationKey: { key: 'HOME_TITLE_1' } },
    { value: 'Ver Cases', translationKey: { key: 'BTN_VIEW_PROJECTS' } },
  ];
  const enRecords = [
    { value: 'Home', translationKey: { key: 'NAV_HOME' } },
    { value: 'We transform', translationKey: { key: 'HOME_TITLE_1' } },
    { value: 'View Cases', translationKey: { key: 'BTN_VIEW_PROJECTS' } },
  ];

  let cache: Cache;
  let repository: jest.Mocked<II18nRepository>;
  let redisClient: { keys: jest.Mock; del: jest.Mock };
  let service: I18nService;

  beforeEach(() => {
    redisClient = {
      keys: jest.fn().mockResolvedValue([]),
      del: jest.fn().mockResolvedValue(0),
    };
    cache = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn().mockResolvedValue(undefined),
      stores: [{ store: { client: redisClient } }],
    } as unknown as Cache;
    repository = {
      findTranslation: jest.fn(),
      findAllByLang: jest.fn(),
      count: jest.fn(),
    };
    service = new I18nService(cache, repository);
  });

  it.each([
    [LanguageCode.PT_BR, ptRecords, 'Início', 'Transformamos', 'Ver Cases'],
    [LanguageCode.EN_US, enRecords, 'Home', 'We transform', 'View Cases'],
  ])('returns required translations for %s', async (lang, records, nav, title, button) => {
    repository.findAllByLang.mockResolvedValue(records as never);

    const result = await service.getTranslations(lang);

    expect(result).toMatchObject({
      NAV_HOME: nav,
      HOME_TITLE_1: title,
      BTN_VIEW_PROJECTS: button,
    });
    expect(cache.set).toHaveBeenCalledWith(
      `i18n:v1:all:${lang}`,
      expect.objectContaining({ NAV_HOME: nav }),
      86400000,
    );
  });

  it('returns a non-empty cache hit without querying the database', async () => {
    (cache.get as jest.Mock).mockResolvedValue({ NAV_HOME: 'Início' });

    await expect(service.getTranslations(LanguageCode.PT_BR)).resolves.toEqual({
      NAV_HOME: 'Início',
    });
    expect(repository.findAllByLang).not.toHaveBeenCalled();
  });

  it('queries the database on a cache miss', async () => {
    repository.findAllByLang.mockResolvedValue(ptRecords as never);

    await service.getTranslations(LanguageCode.PT_BR);

    expect(repository.findAllByLang).toHaveBeenCalledWith(LanguageCode.PT_BR);
  });

  it('does not cache or return an empty database as success', async () => {
    repository.findAllByLang.mockResolvedValue([]);

    await expect(service.getTranslations(LanguageCode.PT_BR)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('treats a legacy empty cache entry as a miss', async () => {
    (cache.get as jest.Mock).mockResolvedValue({});
    repository.findAllByLang.mockResolvedValue([]);

    await expect(service.getTranslations(LanguageCode.PT_BR)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(repository.findAllByLang).toHaveBeenCalledTimes(1);
  });

  it('invalidates only keys in the i18n namespace', async () => {
    const legacyVersion = ['v', 'v', '1'].join('');
    const legacyKey = `i18n:${legacyVersion}:all:PT_BR`;
    redisClient.keys.mockResolvedValue([legacyKey, 'i18n:v1:all:PT_BR']);

    await expect(service.clearCache()).resolves.toEqual({ success: true });

    expect(redisClient.keys).toHaveBeenCalledWith('i18n:*');
    expect(redisClient.del).toHaveBeenCalledWith([
      legacyKey,
      'i18n:v1:all:PT_BR',
    ]);
  });

  it('does not announce a successful warm-up when translations are empty', async () => {
    repository.findAllByLang.mockResolvedValue([]);
    const log = jest.spyOn((service as any).logger, 'log');

    await service.onModuleInit();

    expect(log).not.toHaveBeenCalledWith('I18n translations warm-up completed');
  });
});
