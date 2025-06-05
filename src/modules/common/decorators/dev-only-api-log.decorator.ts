import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiLogInterceptor } from '../interceptors/api-log.interceptor';
import { ENV } from '@/config/environment.config';
export function DevOnlyApiLog() {
  return ENV.NODE_ENV === 'development' ? applyDecorators(UseInterceptors(ApiLogInterceptor)) : applyDecorators();
}
