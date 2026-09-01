import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Request } from 'express';
import { UserRole } from '@prisma/client';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

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

describe('API-002 public contact submission', () => {
  let app: INestApplication;
  const contactsService: jest.Mocked<
    Pick<ContactsService, 'create' | 'findAll' | 'markAsRead' | 'remove'>
  > = {
    create: jest.fn(),
    findAll: jest.fn(),
    markAsRead: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])],
      controllers: [ContactsController],
      providers: [
        { provide: ContactsService, useValue: contactsService },
        RolesGuard,
        { provide: APP_GUARD, useClass: TestJwtGuard },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(TestJwtGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    contactsService.create.mockResolvedValue({ id: 'contact-id' });
  });

  afterEach(async () => {
    await app.close();
  });

  it('allows an anonymous visitor to submit a valid contact', async () => {
    await request(app.getHttpServer())
      .post('/api/contacts')
      .send({
        name: 'Visitor',
        email: 'visitor@example.com',
        subject: 'Project inquiry',
        message: 'Hello',
      })
      .expect(201, { success: true });

    expect(contactsService.create).toHaveBeenCalledWith({
      name: 'Visitor',
      email: 'visitor@example.com',
      subject: 'Project inquiry',
      message: 'Hello',
    });
  });

  it('rejects an invalid payload without persisting it', async () => {
    await request(app.getHttpServer())
      .post('/api/contacts')
      .send({ name: '', email: 'invalid', message: '' })
      .expect(400);

    expect(contactsService.create).not.toHaveBeenCalled();
  });

  it('keeps contact administration protected', async () => {
    await request(app.getHttpServer()).get('/api/contacts').expect(401);
    await request(app.getHttpServer())
      .get('/api/contacts')
      .set('Authorization', 'Bearer user')
      .expect(403);
  });

  it('applies a specific submission rate limit', async () => {
    for (let index = 0; index < 5; index += 1) {
      await request(app.getHttpServer())
        .post('/api/contacts')
        .send({
          name: 'Visitor',
          email: `visitor${index}@example.com`,
          message: 'Hello',
        })
        .expect(201);
    }

    await request(app.getHttpServer())
      .post('/api/contacts')
      .send({
        name: 'Visitor',
        email: 'visitor-last@example.com',
        message: 'Hello',
      })
      .expect(429);
  });
});
