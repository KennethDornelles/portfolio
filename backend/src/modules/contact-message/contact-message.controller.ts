import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactMessageService } from './contact-message.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';

@Controller('contact-message')
export class ContactMessageController {
  constructor(private readonly contactMessageService: ContactMessageService) {}

  @Post()
  create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactMessageService.create(createContactMessageDto);
  }

  @Get()
  findAll() {
    return this.contactMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactMessageDto: UpdateContactMessageDto) {
    return this.contactMessageService.update(+id, updateContactMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactMessageService.remove(+id);
  }
}
