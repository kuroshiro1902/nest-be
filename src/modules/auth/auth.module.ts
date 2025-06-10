import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { DatabaseModule } from '@/modules/database/database.module';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule, DatabaseModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
