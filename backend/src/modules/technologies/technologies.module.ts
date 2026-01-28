import { Module } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { TechnologiesController } from './technologies.controller';
import { PrismaTechnologiesRepository } from './repositories/prisma-technologies.repository';
import { PrismaModule } from '../../modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TechnologiesController],
  providers: [
    TechnologiesService,
    {
      provide: 'ITechnologiesRepository',
      useClass: PrismaTechnologiesRepository,
    },
  ],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}
