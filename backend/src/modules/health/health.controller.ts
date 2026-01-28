
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaService, // Direct injection for custom check
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Check Heap usage (threshold 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Check Database connectivity
      async () => {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return {
                database: {
                    status: 'up',
                },
            };
        } catch (error) {
             return {
                database: {
                    status: 'down',
                    message: error.message,
                },
            }; 
            // Or throw HealthCheckError
        }
      }
    ]);
  }
}
