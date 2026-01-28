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
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
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

  // Helmet - HTTP Security Headers
  app.use(helmet());

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

  // CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:4200'),
    credentials: true,
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