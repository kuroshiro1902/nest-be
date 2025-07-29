import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiRequestLogInterceptor, ApiResponseLogInterceptor } from '../interceptors/api-log.interceptor';
import { ENV } from '@/config/environment.config';
export function DevOnlyApiRequestLog() {
  return ENV.NODE_ENV === 'development'
    ? applyDecorators(UseInterceptors(ApiRequestLogInterceptor))
    : applyDecorators();
}

export function DevOnlyApiResponseLog() {
  return ENV.NODE_ENV === 'development'
    ? applyDecorators(UseInterceptors(ApiResponseLogInterceptor))
    : applyDecorators();
}
