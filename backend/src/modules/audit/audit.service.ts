import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IAuditRepository } from './repositories/audit.repository.interface';
import { Prisma } from '@prisma/client';

export interface AuditEventDto {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Prisma.InputJsonValue;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private auditRepository: IAuditRepository) {}

  @OnEvent('audit.log')
  async handleAuditLog(payload: AuditEventDto) {
    try {
      await this.auditRepository.create({
        userId: payload.userId,
        action: payload.action,
        entity: payload.entity,
        entityId: payload.entityId,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        metadata: payload.metadata || {},
      });
    } catch (error: unknown) {
      this.logger.error(
        'Failed to persist audit log',
        error instanceof Error ? error.message : String(error),
      );
      // In production, send to DLQ (Dead Letter Queue)
    }
  }
}
