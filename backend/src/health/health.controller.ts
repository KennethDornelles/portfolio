import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../database/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Check if the database is healthy
      () => this.prismaHealth.pingCheck('database', this.prisma),
      // Check if the API is responding
      () => this.http.pingCheck('api', 'http://localhost:3000'),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  liveness() {
    // Simple liveness probe - checks if the app is running
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    // Readiness probe - checks if the app is ready to receive traffic
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
