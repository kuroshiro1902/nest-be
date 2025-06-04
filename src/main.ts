import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './env';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(helmet({ xPoweredBy: false }));
  app.enableCors({ origin: ENV.CLIENT_URL, credentials: true });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(ENV.SERVER_PORT, () => {
    console.log(`Server đang chạy tại port ${ENV.SERVER_PORT}`);
  });
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Ghi log ra file
  // fs.appendFileSync(
  //   path.join(logDir, 'uncaught-exceptions.log'),
  //   `${new Date().toISOString()} - Uncaught Exception: ${error.message}\n${error.stack}\n\n`
  // );
  // Không exit process ngay lập tức để có thể ghi log
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Ghi log ra file
  // fs.appendFileSync(
  //   path.join(logDir, 'unhandled-rejections.log'),
  //   `${new Date().toISOString()} - Unhandled Rejection: ${reason}\n\n`
  // );
});

// Thêm xử lý thoát process an toàn
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received, closing app gracefully');
  // Ghi log ra file
  // fs.appendFileSync(
  //   path.join(logDir, 'app-shutdown.log'),
  //   `${new Date().toISOString()} - SIGTERM signal received, shutting down gracefully\n`
  // );
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received, closing app gracefully');
  // Ghi log ra file
  // fs.appendFileSync(
  //   path.join(logDir, 'app-shutdown.log'),
  //   `${new Date().toISOString()} - SIGINT signal received, shutting down gracefully\n`
  // );
  process.exit(0);
});
bootstrap();
