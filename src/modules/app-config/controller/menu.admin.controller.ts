import { Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { EUserRole } from '@/modules/user/entity/user.entity';
import { MenuService } from '../service/menu.service';
import { ZodBody } from '@/modules/common/decorators';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dto/update-menu-item.dto';
import { AuthTokenGuard } from '@/modules/auth/guard/auth-token.guard';
import { RoleGuard } from '@/modules/auth/guard/role.guard';

@Controller('admin/menu')
@Roles(EUserRole.ADMIN)
@UseGuards(AuthTokenGuard, RoleGuard)
export class MenuAdminController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async createOne(@ZodBody(CreateMenuItemDto) body: CreateMenuItemDto) {
    return this.menuService.createOne(body);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @ZodBody(UpdateMenuItemDto) body: UpdateMenuItemDto) {
    return this.menuService.updateOne(id, body);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.menuService.deleteOne(id);
  }
}
