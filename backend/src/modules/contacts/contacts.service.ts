import { Injectable, Logger } from '@nestjs/common';
import { IContactsRepository } from './repositories/contacts.repository.interface';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    private contactsRepository: IContactsRepository,
    private mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const { subject, ...contactData } = createContactDto;
    const contact = await this.contactsRepository.create({
      ...contactData,
      message: subject
        ? `[${subject}]\n\n${contactData.message}`
        : contactData.message,
    });

    try {
      await this.mailService.sendContactAlert(createContactDto);
      this.logger.log(`Contact email sent for ${contact.email}`);
    } catch (error) {
      this.logger.error('Failed to send contact email', error);
    }

    return contact;
  }

  async findAll() {
    return this.contactsRepository.findAll();
  }

  async markAsRead(id: string) {
    return this.contactsRepository.markAsRead(id);
  }

  async remove(id: string) {
    return this.contactsRepository.delete(id);
  }
}
