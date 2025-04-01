import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/pipes/response.interceptor';
import { ENV } from './environment/environment';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({ origin: ENV.CLIENT_URL, credentials: true });
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(ENV.SERVER_PORT);
}
bootstrap();
