import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IAuditRepository } from './audit.repository.interface';
import { Prisma, AuditLog } from '@prisma/client';

@Injectable()
export class PrismaAuditRepository implements IAuditRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AuditLogUncheckedCreateInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data,
    });
  }
}
