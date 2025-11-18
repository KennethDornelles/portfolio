import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Health')
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
  @ApiOperation({ summary: 'Verificar saúde geral da aplicação' })
  @ApiResponse({ status: 200, description: 'Status da aplicação e dependências' })
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
  @ApiOperation({ summary: 'Verificar se a aplicação está rodando' })
  @ApiResponse({ status: 200, description: 'Aplicação está viva' })
  liveness() {
    // Simple liveness probe - checks if the app is running
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Verificar se a aplicação está pronta para receber tráfego' })
  @ApiResponse({ status: 200, description: 'Aplicação está pronta' })
  readiness() {
    // Readiness probe - checks if the app is ready to receive traffic
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
