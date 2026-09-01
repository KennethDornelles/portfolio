import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('PerformanceInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = performance.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    return next.handle().pipe(
      tap(() => {
        const time = performance.now() - now;
        this.logger.log(
          `[Performance] ${method} ${url} took ${time.toFixed(2)}ms`,
        );
      }),
    );
  }
}
