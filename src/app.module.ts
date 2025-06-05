import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { CacheModule } from './modules/cache/cache.module';
import { NotebookModule } from './modules/notebook/notebook.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, CommonModule, CacheModule, NotebookModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
