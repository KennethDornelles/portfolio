import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { I18nService } from './i18n.service';
import { I18nController } from './i18n.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { II18nRepository } from './repositories/i18n.repository.interface';
import { PrismaI18nRepository } from './repositories/prisma-i18n.repository';

@Global()
@Module({
  imports: [
    CacheModule.register(),
    PrismaModule
  ],
  controllers: [I18nController],
  providers: [
    I18nService,
    {
      provide: II18nRepository,
      useClass: PrismaI18nRepository,
    },
  ],
  exports: [I18nService],
})
export class I18nModule {}
