import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { IContactsRepository } from './repositories/contacts.repository.interface';
import { PrismaContactsRepository } from './repositories/prisma-contacts.repository';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [ContactsController],
  providers: [
    ContactsService,
    {
      provide: IContactsRepository,
      useClass: PrismaContactsRepository,
    },
  ],
})
export class ContactsModule {}
