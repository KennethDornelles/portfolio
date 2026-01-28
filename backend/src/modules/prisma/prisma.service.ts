import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    let dbUrl = configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL;

    // Add recommended Supabase/Render pooling params if not present
    if (dbUrl && dbUrl.includes('supabase.co') && !dbUrl.includes('pgbouncer')) {
      const separator = dbUrl.includes('?') ? '&' : '?';
      dbUrl += `${separator}pgbouncer=true&connection_limit=1`;
    }

    super({
      log: ['info', 'warn', 'error'],
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}