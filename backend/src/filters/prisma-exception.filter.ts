import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

interface PrismaErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error: string;
  code?: string;
  details?: unknown;
}

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro no banco de dados';
    let error = 'DatabaseError';
    let code: string | undefined;

    // Tratar erros conhecidos do Prisma
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      code = exception.code;

      switch (exception.code) {
        // Violação de chave única
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = this.getUniqueConstraintMessage(exception);
          error = 'UniqueConstraintViolation';
          break;

        // Registro não encontrado
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Registro não encontrado';
          error = 'NotFound';
          break;

        // Violação de chave estrangeira
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Violação de restrição de chave estrangeira';
          error = 'ForeignKeyConstraintViolation';
          break;

        // Registro dependente existe
        case 'P2014':
          status = HttpStatus.CONFLICT;
          message =
            'Não é possível excluir registro pois existem registros dependentes';
          error = 'DependentRecordsExist';
          break;

        // Valor muito longo
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          message = 'O valor fornecido é muito longo para o campo';
          error = 'ValueTooLong';
          break;

        // Campo obrigatório ausente
        case 'P2011':
          status = HttpStatus.BAD_REQUEST;
          message = 'Campo obrigatório ausente';
          error = 'MissingRequiredField';
          break;

        // Falha na conexão com banco de dados
        case 'P1001':
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message = 'Não foi possível conectar ao banco de dados';
          error = 'DatabaseConnectionError';
          break;

        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Erro ao processar operação no banco de dados';
          error = 'DatabaseError';
      }
    }

    // Tratar erros de validação do Prisma
    if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Erro de validação nos dados fornecidos';
      error = 'ValidationError';
    }

    // Construir resposta de erro
    const errorResponse: PrismaErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      code,
    };

    // Adicionar detalhes em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = {
        originalMessage: exception.message,
        meta: (exception as Prisma.PrismaClientKnownRequestError).meta,
      };
    }

    // Log do erro
    this.logger.error(
      `Prisma Error ${code || 'VALIDATION'}: ${request.method} ${request.url}`,
      JSON.stringify({
        ...errorResponse,
        stack: exception.stack,
      }),
    );

    // Enviar resposta
    response.status(status).json(errorResponse);
  }

  /**
   * Extrai mensagem amigável de erro de violação de constraint única
   */
  private getUniqueConstraintMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    const meta = exception.meta as { target?: string[] };
    const fields = meta?.target;

    if (fields && fields.length > 0) {
      const fieldNames = fields.join(', ');
      return `Já existe um registro com este(s) valor(es) para: ${fieldNames}`;
    }

    return 'Já existe um registro com estes valores';
  }
}
