import { Module, Global } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { I18nController } from './i18n.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { II18nRepository } from './repositories/i18n.repository.interface';
import { PrismaI18nRepository } from './repositories/prisma-i18n.repository';
import { I18nWebhookGuard, I18N_WEBHOOK_CLOCK } from './i18n-webhook.guard';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [I18nController],
  providers: [
    I18nService,
    I18nWebhookGuard,
    {
      provide: I18N_WEBHOOK_CLOCK,
      useValue: () => Date.now(),
    },
    {
      provide: II18nRepository,
      useClass: PrismaI18nRepository,
    },
  ],
  exports: [I18nService],
})
export class I18nModule {}
