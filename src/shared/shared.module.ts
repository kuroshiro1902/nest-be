import { Module } from '@nestjs/common';
import { RequestValidationPipe } from './pipes/request-validation.pipe';
import { ResponseInterceptor } from './pipes/response.interceptor';

@Module({
  providers: [RequestValidationPipe, ResponseInterceptor],
  exports: [RequestValidationPipe, ResponseInterceptor],
})
export class SharedModule {}
