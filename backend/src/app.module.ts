import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuditModule } from './modules/audit/audit.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { ProfileModule } from './modules/profile/profile.module';
import { StorageModule } from './modules/storage/storage.module';
import { TechnologiesModule } from './modules/technologies/technologies.module';
import { HealthModule } from './modules/health/health.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('REDIS_URL') || process.env.REDIS_URL;
        return {
          connection: url
            ? (url as any)
            : {
                host: configService.get<string>('REDIS_HOST') || process.env.REDIS_HOST || 'localhost',
                port: configService.get<number>('REDIS_PORT') || parseInt(process.env.REDIS_PORT || '6379', 10),
              },
        };
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        } : undefined,
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>('REDIS_URL') || process.env.REDIS_URL;
        return {
          store: await redisStore(
            url
              ? { url }
              : {
                  socket: {
                    host: configService.get<string>('REDIS_HOST') || process.env.REDIS_HOST || 'localhost',
                    port: configService.get<number>('REDIS_PORT') || parseInt(process.env.REDIS_PORT || '6379', 10),
                  },
                },
          ),
          ttl: 60000,
        };
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    I18nModule,
    AuditModule,
    ProjectsModule,
    ContactsModule,
    ProfileModule,
    TechnologiesModule,
    StorageModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}