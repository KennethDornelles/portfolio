import {
  Logger,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import type { Cache } from 'cache-manager';
import { I18nWebhookGuard } from './i18n-webhook.guard';

describe('I18nWebhookGuard', () => {
  const nowMs = Date.UTC(2026, 7, 30, 12, 0, 0);
  const timestamp = String(Math.floor(nowMs / 1000));
  const secret = Buffer.alloc(32, 7).toString('hex');
  const body = Buffer.from('{"deploy":true}', 'utf8');
  const replayKeys = new Set<string>();
  let redisSet: jest.Mock;
  let guard: I18nWebhookGuard;

  beforeEach(() => {
    replayKeys.clear();
    redisSet = jest.fn((key: string) => {
      if (replayKeys.has(key)) return Promise.resolve(null);
      replayKeys.add(key);
      return Promise.resolve('OK');
    });
    const cacheManager = {
      stores: [{ store: { client: { set: redisSet } } }],
    } as unknown as Cache;
    const config = {
      get: jest.fn((key: string) => {
        if (key === 'I18N_WEBHOOK_SECRET') return secret;
        if (key === 'I18N_WEBHOOK_TOLERANCE_SECONDS') return '300';
        return undefined;
      }),
    } as unknown as ConfigService;

    guard = new I18nWebhookGuard(config, cacheManager, () => nowMs);
    guard.onModuleInit();
  });

  function signature(
    id: string,
    rawBody = body,
    signedTimestamp = timestamp,
  ): string {
    return createHmac('sha256', secret)
      .update(
        Buffer.concat([
          Buffer.from(`${signedTimestamp}.${id}.`, 'utf8'),
          rawBody,
        ]),
      )
      .digest('hex');
  }

  function context(
    overrides: {
      id?: string;
      rawBody?: Buffer;
      timestamp?: string;
      signature?: string;
      omitSignature?: boolean;
      omitTimestamp?: boolean;
    } = {},
  ): ExecutionContext {
    const id = overrides.id ?? 'event-1';
    const request = {
      headers: {
        ...(!overrides.omitTimestamp && {
          'x-webhook-timestamp': overrides.timestamp ?? timestamp,
        }),
        'x-webhook-id': id,
        ...(!overrides.omitSignature && {
          'x-webhook-signature': overrides.signature ?? signature(id),
        }),
      },
      rawBody: overrides.rawBody ?? body,
    };
    return {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  }

  it('accepts a valid signature and current timestamp', async () => {
    await expect(guard.canActivate(context())).resolves.toBe(true);
    expect(redisSet).toHaveBeenCalledWith('webhook:i18n:replay:event-1', '1', {
      NX: true,
      PX: 300000,
    });
  });

  it('rejects a missing signature', async () => {
    await expect(
      guard.canActivate(context({ omitSignature: true })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an invalid signature', async () => {
    await expect(
      guard.canActivate(context({ signature: '0'.repeat(64) })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a body changed after signing', async () => {
    await expect(
      guard.canActivate(context({ rawBody: Buffer.from('{"deploy":false}') })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an absent timestamp', async () => {
    await expect(
      guard.canActivate(context({ omitTimestamp: true })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it.each(['not-a-time', '123'])(
    'rejects a malformed timestamp: %s',
    async (value) => {
      await expect(
        guard.canActivate(context({ timestamp: value })),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    },
  );

  it('rejects an expired timestamp using the injected clock', async () => {
    const oldTimestamp = String(Number(timestamp) - 301);
    await expect(
      guard.canActivate(
        context({
          timestamp: oldTimestamp,
          signature: signature('event-1', body, oldTimestamp),
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('atomically rejects the same event id on its second use', async () => {
    await expect(guard.canActivate(context())).resolves.toBe(true);
    await expect(guard.canActivate(context())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('fails closed when the replay store is unavailable', async () => {
    redisSet.mockRejectedValueOnce(new Error('redis unavailable'));
    await expect(guard.canActivate(context())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it.each(['xyz', 'aa', 'g'.repeat(64), 'a'.repeat(66)])(
    'rejects malformed signatures without throwing a comparison error: %s',
    async (malformed) => {
      await expect(
        guard.canActivate(context({ signature: malformed })),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    },
  );

  it('does not log the secret, signature, or raw body on replay failure', async () => {
    const logger = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const signed = signature('event-1');
    redisSet.mockRejectedValueOnce(
      new Error(`redis ${secret} ${signed} ${body.toString()}`),
    );

    await expect(
      guard.canActivate(context({ signature: signed })),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const logged = JSON.stringify(logger.mock.calls);
    expect(logged).not.toContain(secret);
    expect(logged).not.toContain(signed);
    expect(logged).not.toContain(body.toString());
    logger.mockRestore();
  });
});
