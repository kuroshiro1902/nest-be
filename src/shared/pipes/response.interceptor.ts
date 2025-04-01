import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
      catchError((error) => {
        const status = +error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(
          {
            success: false,
            message: error.response?.message || error.message || 'Internal server error.',
            statusCode: status,
            data: error.response?.data,
          },
          status,
        );
      }),
    );
  }
}
