import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { PrismaService } from '../../database/prisma.service';
import { ContactMessage } from './entities/contact-message.entity';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class ContactMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createContactMessageDto: CreateContactMessageDto,
  ): Promise<ContactMessage> {
    return await this.prisma.contactMessage.create({
      data: createContactMessageDto,
    });
  }

  async findAll(): Promise<ContactMessage[]> {
    return await this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: MessageStatus): Promise<ContactMessage[]> {
    return await this.prisma.contactMessage.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<ContactMessage> {
    const contactMessage = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!contactMessage) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }

    return contactMessage;
  }

  async update(
    id: string,
    updateContactMessageDto: UpdateContactMessageDto,
  ): Promise<ContactMessage> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.contactMessage.update({
      where: { id },
      data: updateContactMessageDto,
    });
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    return await this.update(id, { status: MessageStatus.READ });
  }

  async markAsArchived(id: string): Promise<ContactMessage> {
    return await this.update(id, { status: MessageStatus.ARCHIVED });
  }

  async remove(id: string): Promise<ContactMessage> {
    await this.findOne(id); // Verifica se existe

    return await this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
