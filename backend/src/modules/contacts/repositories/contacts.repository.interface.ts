import { Contact, Prisma } from '@prisma/client';

export abstract class IContactsRepository {
  abstract create(data: Prisma.ContactCreateInput): Promise<Contact>;
  abstract findAll(): Promise<Contact[]>;
  abstract markAsRead(id: string): Promise<Contact>;
}
