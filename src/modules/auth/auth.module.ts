import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { DatabaseModule } from '@/modules/database/database.module';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from '../common/common.module';
import { CacheModule } from '../cache/cache.module';
import { AuthTokenGuard } from './guard/auth-token.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CommonModule, UserModule, CacheModule, JwtModule],
  providers: [AuthService, AuthTokenGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
