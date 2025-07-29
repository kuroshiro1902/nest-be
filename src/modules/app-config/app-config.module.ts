import { Module } from '@nestjs/common';
import { MenuService } from './service/menu.service';
import { MenuAdminController } from './controller/menu.admin.controller';
import { MenuController } from './controller/menu.controller';
import { CacheModule } from '../cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem, MenuItemRelation } from './entity/menu-item.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, MenuItemRelation]), CacheModule, AuthModule],
  providers: [MenuService],
  controllers: [MenuAdminController, MenuController],
  exports: [MenuService],
})
export class AppConfigModule {}
