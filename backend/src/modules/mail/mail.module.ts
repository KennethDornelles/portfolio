import { Module } from '@nestjs/common';
import { MailService, ConsoleMailProvider } from './mail.service';

@Module({
  providers: [
    MailService,
    {
      provide: 'MAIL_PROVIDER',
      useClass: ConsoleMailProvider,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
