import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

/**
 * Módulo de Autenticação
 *
 * Fornece proteção de endpoints através de API Key Guard.
 * Para marcar rotas como públicas, use o decorator @Public().
 */
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
