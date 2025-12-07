import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('🔐 Autenticação')
@ApiSecurity('api-key')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify')
  @ApiOperation({
    summary: 'Verificar validade da API Key',
    description: 'Endpoint para testar se a API Key fornecida é válida',
  })
  @ApiResponse({
    status: 200,
    description: 'API Key válida',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'API Key válida',
        },
        timestamp: {
          type: 'string',
          example: '2025-12-07T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'API Key inválida ou ausente' })
  async verify(): Promise<{ message: string; timestamp: string }> {
    return this.authService.verifyApiKey();
  }
}
