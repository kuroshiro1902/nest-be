import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiRequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query, params } = request ?? {};
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    // Log request
    this.logger.log(`[REQUEST] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`);

    if (Object.keys(body ?? {}).length > 0) {
      this.logger.debug('Body:', body);
    }
    if (Object.keys(query ?? {}).length > 0) {
      this.logger.debug('Query:', query);
    }
    if (Object.keys(params ?? {}).length > 0) {
      this.logger.debug('Params:', params);
    }

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (_) => {
          const duration = Date.now() - now;
          this.logger.log(`[RESPONSE] ${method} ${originalUrl} - ${duration}ms - Success`);
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(`[ERROR] ${method} ${originalUrl} - ${duration}ms - ${error.message}`, error.stack);
        },
      }),
    );
  }
}
@Injectable()
export class ApiResponseLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const duration = Date.now() - now;

          this.logger.log(
            `[RESPONSE] ${method} ${originalUrl} - ${duration}ms - IP: ${ip} - UA: ${userAgent} - RETURN: ${JSON.stringify(
              responseBody,
            )}`,
          );
        },
        error: (err) => {
          const duration = Date.now() - now;
          this.logger.error(`[ERROR] ${method} ${originalUrl} - ${duration}ms - ${err.message}`, err.stack);
        },
      }),
    );
  }
}
