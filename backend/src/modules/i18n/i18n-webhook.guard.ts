import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
  type RawBodyRequest,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { createHmac, timingSafeEqual } from 'crypto';
import type { Request } from 'express';
import { getI18nRedisStore } from './i18n-redis-store';

export const I18N_WEBHOOK_CLOCK = Symbol('I18N_WEBHOOK_CLOCK');

const SIGNATURE_PATTERN = /^[a-fA-F0-9]{64}$/;
const TIMESTAMP_PATTERN = /^\d{10}$/;
const WEBHOOK_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
const DEFAULT_TOLERANCE_SECONDS = 300;
const MAX_TOLERANCE_SECONDS = 3600;

@Injectable()
export class I18nWebhookGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(I18nWebhookGuard.name);
  private secret = '';
  private toleranceSeconds = DEFAULT_TOLERANCE_SECONDS;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(I18N_WEBHOOK_CLOCK) private readonly clock: () => number,
  ) {}

  onModuleInit(): void {
    const secret = this.configService
      .get<string>('I18N_WEBHOOK_SECRET')
      ?.trim();
    if (!secret) {
      throw new Error('I18N_WEBHOOK_SECRET must be configured');
    }

    const configuredTolerance = this.configService.get<string>(
      'I18N_WEBHOOK_TOLERANCE_SECONDS',
    );
    const tolerance = configuredTolerance
      ? Number(configuredTolerance)
      : DEFAULT_TOLERANCE_SECONDS;

    if (
      !Number.isInteger(tolerance) ||
      tolerance <= 0 ||
      tolerance > MAX_TOLERANCE_SECONDS
    ) {
      throw new Error(
        'I18N_WEBHOOK_TOLERANCE_SECONDS must be between 1 and 3600',
      );
    }

    this.secret = secret;
    this.toleranceSeconds = tolerance;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RawBodyRequest<Request>>();
    const timestampHeader = this.getSingleHeader(
      request,
      'x-webhook-timestamp',
    );
    const webhookId = this.getSingleHeader(request, 'x-webhook-id');
    const signature = this.getSingleHeader(request, 'x-webhook-signature');

    if (
      !timestampHeader ||
      !TIMESTAMP_PATTERN.test(timestampHeader) ||
      !webhookId ||
      !WEBHOOK_ID_PATTERN.test(webhookId) ||
      !signature ||
      !SIGNATURE_PATTERN.test(signature) ||
      !request.rawBody
    ) {
      throw this.unauthorized();
    }

    const timestamp = Number(timestampHeader);
    const now = Math.floor(this.clock() / 1000);
    if (
      !Number.isSafeInteger(timestamp) ||
      Math.abs(now - timestamp) > this.toleranceSeconds
    ) {
      throw this.unauthorized();
    }

    const signedPayload = Buffer.concat([
      Buffer.from(`${timestampHeader}.${webhookId}.`, 'utf8'),
      request.rawBody,
    ]);
    const expected = createHmac('sha256', this.secret)
      .update(signedPayload)
      .digest();
    const supplied = Buffer.from(signature, 'hex');

    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      throw this.unauthorized();
    }

    try {
      const store = getI18nRedisStore(this.cacheManager);
      if (!store) {
        throw new Error('Redis store unavailable');
      }

      const reserved = await store.client.set(
        `webhook:i18n:replay:${webhookId}`,
        '1',
        { NX: true, PX: this.toleranceSeconds * 1000 },
      );

      if (reserved !== 'OK') {
        throw this.unauthorized();
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Webhook replay verification unavailable');
      throw this.unauthorized();
    }

    return true;
  }

  private getSingleHeader(request: Request, name: string): string | undefined {
    const value = request.headers[name];
    return typeof value === 'string' ? value : undefined;
  }

  private unauthorized(): UnauthorizedException {
    return new UnauthorizedException('Webhook authentication failed');
  }
}
