import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';
import { PermissionModule } from '@/permission/permission.module';
import { AuthController } from './auth.controller';
import { SharedModule } from '@/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';

@Module({
  imports: [SharedModule, UserModule, PermissionModule, JwtModule],
  providers: [AuthService, JwtAccessTokenGuard],
  controllers: [AuthController],
})
export class AuthModule {}
