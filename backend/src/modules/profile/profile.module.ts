import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IProfileRepository } from './repositories/profile.repository.interface';
import { PrismaProfileRepository } from './repositories/prisma-profile.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    {
      provide: IProfileRepository,
      useClass: PrismaProfileRepository,
    },
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
