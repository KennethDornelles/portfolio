import { Prisma, AuditLog } from '@prisma/client';

export abstract class IAuditRepository {
  abstract create(data: Prisma.AuditLogUncheckedCreateInput): Promise<AuditLog>;
}
