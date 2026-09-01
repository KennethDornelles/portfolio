import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest<Request>();
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message:
        exception instanceof HttpException
          ? (exception.getResponse() as unknown)
          : 'Internal server error',
    };

    if (httpStatus === Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
      this.logger.error(
        `Exception: ${JSON.stringify(responseBody)}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`Exception: ${JSON.stringify(responseBody)}`);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
