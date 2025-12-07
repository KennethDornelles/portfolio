import { Injectable } from '@nestjs/common';

/**
 * Serviço de Autenticação
 *
 * Fornece métodos auxiliares para autenticação com API Key.
 * A validação real é feita pelo ApiKeyGuard.
 */
@Injectable()
export class AuthService {
  /**
   * Verifica se a API Key é válida (endpoint de teste)
   * Se a requisição chegar aqui, significa que passou pelo ApiKeyGuard
   */
  async verifyApiKey(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'API Key válida',
      timestamp: new Date().toISOString(),
    };
  }
}
