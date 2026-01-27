import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma/prisma.module';

import { IAuditRepository } from './repositories/audit.repository.interface';
import { PrismaAuditRepository } from './repositories/prisma-audit.repository';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    AuditService,
    {
      provide: IAuditRepository,
      useClass: PrismaAuditRepository,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}
