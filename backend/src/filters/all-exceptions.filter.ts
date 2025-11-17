import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface GenericErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error: string;
  details?: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar status HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Determinar mensagem de erro
    let message = 'Erro interno do servidor';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (
              exceptionResponse as Record<string, unknown>
            ).message?.toString() || 'Erro interno do servidor';
      error = exception.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Construir resposta de erro
    const errorResponse: GenericErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    // Adicionar detalhes em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      errorResponse.details = {
        stack: exception.stack,
        cause: exception.cause,
      };
    }

    // Log crítico para erros não tratados
    this.logger.error(
      `Unhandled Exception: ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    // Enviar resposta
    response.status(status).json(errorResponse);
  }
}
