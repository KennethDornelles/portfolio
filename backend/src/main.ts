import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  // Startup Validation Logging
  console.log('--- Startup Configuration Check ---');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`REDIS_URL defined: ${!!process.env.REDIS_URL}`);
  console.log(`REDIS_HOST defined: ${!!process.env.REDIS_HOST}`);
  console.log(`DATABASE_URL defined: ${!!process.env.DATABASE_URL}`);
  if (process.env.DATABASE_URL?.includes('supabase')) {
    console.log('Detected Supabase URL');
  }
  console.log('-----------------------------------');
  // Cache flush trigger

  // Helmet - HTTP Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Desativa apenas o CSP se necessário, mantendo as outras proteções
    }),
  );

  // Global Validation Pipe - OBRIGATÓRIO para class-validator funcionar
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: true, // Lança erro se houver propriedades extras
      transform: true, // Transforma payloads em instâncias de DTO
      transformOptions: {
        enableImplicitConversion: true, // Conversão automática de tipos
      },
    }),
  );

  // Configurar CORS
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:4200',
        'http://localhost:4200',
        'https://olustack.com.br', // Adicionado
        'https://www.olustack.com.br', // Adicionado
      ];

      if (!origin) return callback(null, true);

      // Verifica se está na lista, se termina em .vercel.app ou se é o seu novo domínio
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('olustack.com.br') // Cobre subdomínios também
      ) {
        callback(null, true);
      } else {
        console.warn(`Blocked CORS for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API documentation for the Portfolio application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
void bootstrap();
