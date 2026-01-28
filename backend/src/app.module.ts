import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      connection: process.env.REDIS_URL
        ? (process.env.REDIS_URL as any)
        : {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
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
      useFactory: async () => ({
        store: await redisStore(
          process.env.REDIS_URL
            ? { url: process.env.REDIS_URL }
            : {
                socket: {
                  host: process.env.REDIS_HOST || 'localhost',
                  port: parseInt(process.env.REDIS_PORT || '6379', 10),
                },
              },
        ),
        ttl: 60000,
      }),
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