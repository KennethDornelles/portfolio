import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
  AllExceptionsFilter,
} from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obter ConfigService
  const configService = app.get(ConfigService);

  // Configurar CORS
  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: configService.get<boolean>('cors.credentials'),
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Configurar prefixo global da API
  app.setGlobalPrefix(configService.get<string>('api.prefix') || 'api');

  // Configurar Exception Filters globais
  // A ordem importa: filtros mais específicos primeiro, genéricos por último
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
    new AllExceptionsFilter(),
  );

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas dos DTOs
      forbidNonWhitelisted: true, // Lança erro se propriedades não permitidas forem enviadas
      transform: true, // Transforma payloads em instâncias de DTO
      transformOptions: {
        enableImplicitConversion: true, // Converte tipos automaticamente
      },
    }),
  );

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
