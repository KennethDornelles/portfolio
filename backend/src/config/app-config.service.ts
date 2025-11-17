import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Exemplo de serviço que demonstra o uso do ConfigService
 * para acessar variáveis de ambiente de forma tipada e segura.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Retorna o ambiente atual da aplicação
   */
  get environment(): string {
    return this.configService.get<string>('environment', 'development');
  }

  /**
   * Verifica se está em ambiente de produção
   */
  get isProduction(): boolean {
    return this.environment === 'production';
  }

  /**
   * Verifica se está em ambiente de desenvolvimento
   */
  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  /**
   * Retorna a porta do servidor
   */
  get port(): number {
    return this.configService.get<number>('port', 3000);
  }

  /**
   * Retorna o prefixo global da API
   */
  get apiPrefix(): string {
    return this.configService.get<string>('api.prefix', 'api');
  }

  /**
   * Retorna a URL do banco de dados
   */
  get databaseUrl(): string {
    return this.configService.get<string>('database.url', '');
  }

  /**
   * Retorna a origem permitida para CORS
   */
  get corsOrigin(): string {
    return this.configService.get<string>(
      'cors.origin',
      'http://localhost:4200',
    );
  }

  /**
   * Verifica se as credenciais estão habilitadas para CORS
   */
  get corsCredentials(): boolean {
    return this.configService.get<boolean>('cors.credentials', true);
  }

  /**
   * Exemplo de método que retorna todas as configurações
   */
  getAllConfig() {
    return {
      environment: this.environment,
      isProduction: this.isProduction,
      isDevelopment: this.isDevelopment,
      port: this.port,
      apiPrefix: this.apiPrefix,
      cors: {
        origin: this.corsOrigin,
        credentials: this.corsCredentials,
      },
    };
  }
}
