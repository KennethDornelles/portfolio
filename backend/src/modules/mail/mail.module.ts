import { Module, Global } from '@nestjs/common';
import { MailService, ConsoleMailProvider, ResendMailProvider } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';

@Global()
@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [
    MailService,
    MailProcessor,
    {
      provide: 'MAIL_PROVIDER',
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get('RESEND_API_KEY');
        if (apiKey) {
          return new ResendMailProvider(configService);
        }
        return new ConsoleMailProvider();
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailService],
})
export class MailModule {}
