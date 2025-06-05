import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query, params } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    // Log request
    this.logger.log(`[REQUEST] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`);

    if (Object.keys(body).length > 0) {
      this.logger.debug('Body:', body);
    }
    if (Object.keys(query).length > 0) {
      this.logger.debug('Query:', query);
    }
    if (Object.keys(params).length > 0) {
      this.logger.debug('Params:', params);
    }

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - now;
          this.logger.log(`[RESPONSE] ${method} ${originalUrl} - ${duration}ms - Success`);
          // this.logger.debug('Response data:', data);
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(`[ERROR] ${method} ${originalUrl} - ${duration}ms - ${error.message}`, error.stack);
        },
      }),
    );
  }
}
