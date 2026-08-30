import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserRole } from '@prisma/client';
import request from 'supertest';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { I18nController } from './i18n.controller';
import { I18nService } from './i18n.service';
import { I18nWebhookGuard } from './i18n-webhook.guard';

@Injectable()
class TestJwtGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const httpRequest = context
      .switchToHttp()
      .getRequest<Request & { user?: { role: UserRole } }>();
    const authorization = httpRequest.headers.authorization;
    if (!authorization) throw new UnauthorizedException();
    httpRequest.user = {
      role: authorization === 'Bearer admin' ? UserRole.ADMIN : UserRole.USER,
    };
    return true;
  }
}

describe('I18nController security', () => {
  let app: INestApplication;
  let service: {
    refreshCache: jest.Mock;
    getCacheHealth: jest.Mock;
    clearCache: jest.Mock;
    getTranslations: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      refreshCache: jest.fn().mockResolvedValue(undefined),
      getCacheHealth: jest.fn().mockResolvedValue({ status: 'up' }),
      clearCache: jest.fn().mockResolvedValue({ success: true }),
      getTranslations: jest.fn().mockResolvedValue({}),
    };
    const moduleBuilder = Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])],
      controllers: [I18nController],
      providers: [
        RolesGuard,
        { provide: I18nService, useValue: service },
        { provide: APP_GUARD, useClass: TestJwtGuard },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    });
    moduleBuilder
      .overrideGuard(I18nWebhookGuard)
      .useValue({ canActivate: () => true });
    const moduleRef = await moduleBuilder.compile();
    app = moduleRef.createNestApplication({ rawBody: true });
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  it('returns 401 to anonymous cache diagnostics', async () => {
    await request(app.getHttpServer())
      .get('/api/i18n/health/cache')
      .expect(401);
  });

  it('returns 403 to an authenticated non-admin user', async () => {
    await request(app.getHttpServer())
      .get('/api/i18n/health/cache')
      .set('Authorization', 'Bearer user')
      .expect(403);
  });

  it('allows an admin and returns a sanitized diagnostic', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/i18n/health/cache')
      .set('Authorization', 'Bearer admin')
      .expect(200);
    expect(response.body).toEqual({ status: 'up' });
    expect(JSON.stringify(response.body)).not.toMatch(
      /host|key|value|connection|stack/i,
    );
  });

  it('does not accept a query-string secret as authorization', async () => {
    await request(app.getHttpServer())
      .get('/api/i18n/health/cache?secret=anything')
      .expect(401);
  });

  it('allows an admin to clear cache with POST', async () => {
    await request(app.getHttpServer())
      .post('/api/i18n/cache/clear')
      .set('Authorization', 'Bearer admin')
      .expect(201, { success: true });
    expect(service.clearCache).toHaveBeenCalledTimes(1);
  });

  it('does not execute cache mutation through the old GET method', async () => {
    await request(app.getHttpServer())
      .get('/api/i18n/cache/clear')
      .set('Authorization', 'Bearer admin')
      .expect(404);
    expect(service.clearCache).not.toHaveBeenCalled();
  });

  it('does not expose stack traces or internal errors', async () => {
    service.clearCache.mockResolvedValueOnce({ success: false });
    const response = await request(app.getHttpServer())
      .post('/api/i18n/cache/clear')
      .set('Authorization', 'Bearer admin')
      .expect(503);
    expect(JSON.stringify(response.body)).not.toMatch(
      /stack|redis|prisma|localhost/i,
    );
  });

  it('applies the endpoint-specific diagnostics rate limit', async () => {
    for (let index = 0; index < 10; index += 1) {
      await request(app.getHttpServer())
        .get('/api/i18n/health/cache')
        .set('Authorization', 'Bearer admin')
        .expect(200);
    }
    await request(app.getHttpServer())
      .get('/api/i18n/health/cache')
      .set('Authorization', 'Bearer admin')
      .expect(429);
  });
});
