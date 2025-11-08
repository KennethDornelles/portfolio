import { MessageStatus } from '@prisma/client';

export class ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
}
