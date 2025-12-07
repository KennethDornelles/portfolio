import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../../../decorators';
import { Request } from 'express';

/**
 * Guard para proteger endpoints com API Key
 *
 * Este guard verifica se a requisição contém uma API Key válida no header 'x-api-key'.
 * Rotas marcadas com @Public() são permitidas sem verificação.
 *
 * @example
 * ```typescript
 * @UseGuards(ApiKeyGuard)
 * @Controller('projects')
 * export class ProjectController {
 *   @Get()
 *   findAll() { ... }
 * }
 * ```
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  private readonly validApiKey: string;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.validApiKey = this.configService.get<string>('apiKey') || '';
    
    if (!this.validApiKey) {
      this.logger.warn(
        '⚠️ API_KEY não configurada! Configure a variável de ambiente API_KEY.',
      );
    }
  }  canActivate(context: ExecutionContext): boolean {
    // Verifica se a rota está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se a rota for pública, permite acesso sem verificação
    if (isPublic) {
      this.logger.debug('✅ Rota pública - acesso permitido');
      return true;
    }

    // Obtém a requisição HTTP
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;

    // Verifica se a API Key foi fornecida
    if (!apiKey) {
      this.logger.warn('❌ API Key ausente na requisição');
      throw new UnauthorizedException('API Key não fornecida');
    }

    // Valida a API Key
    if (apiKey !== this.validApiKey) {
      this.logger.warn('❌ API Key inválida fornecida');
      throw new UnauthorizedException('API Key inválida');
    }

    this.logger.debug('✅ API Key válida - acesso permitido');
    return true;
  }
}
