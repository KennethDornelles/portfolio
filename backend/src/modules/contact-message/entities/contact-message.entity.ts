import { MessageStatus } from '@prisma/client';

export class ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: MessageStatus;
  createdAt: Date;
}
