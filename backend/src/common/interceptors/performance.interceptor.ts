import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('PerformanceInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = performance.now();
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.url;
    const requestId = req.header('x-request-id') || 'unknown';
    const response = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>();

    return next.handle().pipe(
      finalize(() => {
        const time = performance.now() - now;
        this.logger.log(
          JSON.stringify({
            event: 'http.request.completed',
            requestId,
            method,
            url,
            statusCode: response.statusCode,
            durationMs: Number(time.toFixed(2)),
          }),
        );
      }),
    );
  }
}
