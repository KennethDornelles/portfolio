import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API completa para gerenciamento de portfólio pessoal')
    .setVersion('1.0')
    .addTag('Personal Info', 'Gerenciamento de informações pessoais')
    .addTag('Education', 'Gerenciamento de formação acadêmica')
    .addTag('Experience', 'Gerenciamento de experiências profissionais')
    .addTag('Skills', 'Gerenciamento de habilidades técnicas')
    .addTag('Projects', 'Gerenciamento de projetos')
    .addTag('Services', 'Gerenciamento de serviços oferecidos')
    .addTag('Code Examples', 'Gerenciamento de exemplos de código')
    .addTag('Social Links', 'Gerenciamento de links de redes sociais')
    .addTag('Testimonials', 'Gerenciamento de depoimentos')
    .addTag('Contact Messages', 'Gerenciamento de mensagens de contato')
    .addTag('Health', 'Verificação de saúde da aplicação')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
