import { Injectable } from '@nestjs/common';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';

@Injectable()
export class ContactMessageService {
  create(_createContactMessageDto: CreateContactMessageDto) {
    return 'This action adds a new contactMessage';
  }

  findAll() {
    return `This action returns all contactMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contactMessage`;
  }

  update(id: number, _updateContactMessageDto: UpdateContactMessageDto) {
    return `This action updates a #${id} contactMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} contactMessage`;
  }
}
