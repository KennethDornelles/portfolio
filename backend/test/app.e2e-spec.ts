import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
  AllExceptionsFilter,
} from './../src/filters';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurar CORS
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    // Configurar prefixo global da API
    app.setGlobalPrefix('api');

    // Configurar Exception Filters globais
    app.useGlobalFilters(
      new HttpExceptionFilter(),
      new PrismaExceptionFilter(),
      new AllExceptionsFilter(),
    );

    // Configurar ValidationPipe global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api/health (GET) - should return health status', () => {
    return request(app.getHttpServer()).get('/api/health').expect(200);
  });

  it('should handle CORS preflight request', () => {
    return request(app.getHttpServer())
      .options('/api/health')
      .set('Origin', 'http://localhost:4200')
      .set('Access-Control-Request-Method', 'GET')
      .expect(204);
  });

  it('should include CORS headers in response', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .set('Origin', 'http://localhost:4200')
      .expect(200)
      .expect('Access-Control-Allow-Origin', 'http://localhost:4200');
  });
});
