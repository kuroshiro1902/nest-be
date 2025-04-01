import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '@/database/database.module';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  imports: [DatabaseModule, PermissionModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
