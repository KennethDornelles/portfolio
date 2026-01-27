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
    const contact = await this.contactsRepository.create(createContactDto);

    try {
      await this.mailService.sendWelcome(createContactDto.email); // Reusing sendWelcome for now, ideally sendContactAlert
      // TODO: Implement a specific method in MailService for contact alerts
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
}
