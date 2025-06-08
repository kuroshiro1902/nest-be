import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { DatabaseModule } from '@/modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService],
})
export class AuthModule {}
