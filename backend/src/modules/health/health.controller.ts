import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
  MicroserviceHealthIndicator,
  HealthCheckError,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../../common/decorators';
import { Transport } from '@nestjs/microservices';
import { parseRedisUrl } from '../../common/utils/redis.util';

interface RedisHealthOptions {
  host: string;
  port: number;
  password?: string;
  tls?: unknown;
}

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaService,
    private db: PrismaHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    const url = this.configService.get<string>('app.redis.url');
    const parsedUrl = parseRedisUrl(url || '');

    let redisOptions: RedisHealthOptions = {
      host: this.configService.get<string>('app.redis.host', 'localhost'),
      port: this.configService.get<number>('app.redis.port', 6379),
    };

    if (parsedUrl) {
      redisOptions = {
        host: parsedUrl.host,
        port: parsedUrl.port,
        password: parsedUrl.password,
        tls: parsedUrl.tls,
      };
    }

    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.db
          .pingCheck('database', this.prisma, { timeout: 5000 })
          .catch((error) => {
            if (
              this.configService.get<string>('app.nodeEnv') === 'production' &&
              error instanceof HealthCheckError
            ) {
              const causes = error.causes as Record<
                string,
                { message: string }
              >;
              if (causes.database) {
                causes.database.message = 'Database connection failed';
                throw new HealthCheckError('Health check failed', causes);
              }
            }
            throw error;
          }),
      () =>
        this.microservice
          .pingCheck('redis', {
            transport: Transport.REDIS,
            timeout: 3000,
            options: redisOptions,
          })
          .catch((error) => {
            if (
              this.configService.get<string>('app.nodeEnv') === 'production' &&
              error instanceof HealthCheckError
            ) {
              const causes = error.causes as Record<
                string,
                { message: string }
              >;
              if (causes.redis) {
                causes.redis.message = 'Redis connection failed';
                throw new HealthCheckError('Health check failed', causes);
              }
            }
            throw error;
          }),
    ]);
  }
}
