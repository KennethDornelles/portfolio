import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

import { IRefreshTokenRepository } from './repositories/refresh-token.repository.interface';
import { PrismaRefreshTokenRepository } from './repositories/prisma-refresh-token.repository';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    RtStrategy,
    {
      provide: IRefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
