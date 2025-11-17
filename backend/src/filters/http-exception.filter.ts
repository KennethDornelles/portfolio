import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  details?: unknown;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extrair mensagem e detalhes da resposta da exceção
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, unknown>).message ||
          'Erro interno do servidor';

    const error =
      typeof exceptionResponse === 'object' && 'error' in exceptionResponse
        ? (exceptionResponse as Record<string, unknown>).error
        : exception.name;

    // Construir resposta de erro padronizada
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message as string | string[],
      error: error as string,
    };

    // Adicionar detalhes adicionais em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = exceptionResponse;
    }

    // Log do erro
    this.logger.error(
      `HTTP ${status} Error: ${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
    );

    // Enviar resposta
    response.status(status).json(errorResponse);
  }
}
