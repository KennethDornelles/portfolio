import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IContactsRepository } from './contacts.repository.interface';
import { Prisma, Contact } from '@prisma/client';

@Injectable()
export class PrismaContactsRepository implements IContactsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ContactCreateInput): Promise<Contact> {
    return this.prisma.contact.create({
      data,
    });
  }

  async findAll(): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string): Promise<Contact> {
    return this.prisma.contact.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }
}
