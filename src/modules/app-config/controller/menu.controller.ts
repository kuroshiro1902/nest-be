import { Controller, Get, Query } from '@nestjs/common';
import { MenuService } from '../service/menu.service';
import { ZodQuery } from '@/modules/common/decorators';
import { SearchMenuItemDto } from '../dto/search-menu-item.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('search')
  async search(@ZodQuery(SearchMenuItemDto) query: SearchMenuItemDto) {
    return this.menuService.search(query);
  }

  @Get()
  async getAll(@Query('parentId') parentId?: string) {
    return this.menuService.getAll({ parentId });
  }
}
