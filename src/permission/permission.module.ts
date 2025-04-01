import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
  providers: [PermissionService],
  imports: [DatabaseModule],
})
export class PermissionModule {}
