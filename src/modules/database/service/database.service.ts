import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  async onModuleInit() {
    await this.$connect().then(() => {
      this.logger.log('Kết nối thành công tới database.');
    });
  }
  async onModuleDestroy() {
    await this.$disconnect().then(() => {
      this.logger.log('Đóng kết nối thành công tới database.');
    });
  }
}
