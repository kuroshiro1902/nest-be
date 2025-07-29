import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@/modules/common/service/base.service';
import { MenuItem, MenuItemRelation } from '../entity/menu-item.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from '@/modules/cache/service/cache.service';
import { MENU_CACHE_KEY, MENU_CACHE_TTL } from '../constant/menu-cache.const';
import type { CreateMenuItemDto } from '../dto/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dto/update-menu-item.dto';
import { SearchMenuItemDto } from '../dto/search-menu-item.dto';
import { PageResult } from '@/modules/common/dto/pagination.model';

@Injectable()
export class MenuService extends BaseService<MenuItem> {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemRelation)
    private readonly menuItemRelationRepository: Repository<MenuItemRelation>,
    private readonly cacheService: CacheService,
    private readonly dataSource: DataSource,
  ) {
    super(menuItemRepository);
  }

  async getAll(query: { parentId?: string } = {}): Promise<MenuItem[]> {
    const cacheKey = MENU_CACHE_KEY.BY_PARENT(query.parentId);
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        if (query.parentId) {
          // Lấy children của một parent cụ thể
          const relations = await this.menuItemRelationRepository.find({
            where: { parentId: query.parentId },
            relations: { menuItem: true },
          });

          return relations.map((relation) => relation.menuItem).sort((a, b) => a.order - b.order);
        } else {
          // Lấy tất cả root items (không có parent)
          const rootItems = await this.menuItemRepository.find({
            where: {
              parentRelations: [],
            },
            order: { order: 'ASC' },
          });
          return rootItems;
        }
      },
      MENU_CACHE_TTL.LONG,
    );
  }

  async createOne(data: CreateMenuItemDto): Promise<MenuItem> {
    const { parentId, label, path, icon, order } = data;
    return this.dataSource.transaction(async (tx) => {
      const menuItem = await tx.save(MenuItem, { label, path, icon, order });
      if (parentId) {
        await tx.save(MenuItemRelation, { menuItemId: menuItem.id, parentId });
      }
      return menuItem;
    });
  }

  async updateOne(id: string, data: UpdateMenuItemDto): Promise<MenuItem> {
    const menuItem = await this.findOneOrThrow(id);
    return this.menuItemRepository.save(this.menuItemRepository.merge(menuItem, data));
  }

  async deleteOne(id: string): Promise<void> {
    const menuItem = await this.findOneOrThrow(id);
    await this.dataSource.transaction(async (tx) => {
      await tx.delete(MenuItemRelation, { menuItemId: id });
      await tx.softRemove(menuItem);
    });
  }

  async findOneOrThrow(id: string): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }
    return menuItem;
  }

  async search(query: SearchMenuItemDto): Promise<PageResult<MenuItem>> {
    const { search, ...pageInput } = query;
    return this.paginate(pageInput, {
      where: { label: search ? ILike(`%${search}%`) : undefined },
    });
  }

  private async getChildren(menuItemId: string): Promise<MenuItem[]> {
    const relations = await this.menuItemRelationRepository.find({
      where: { parentId: menuItemId },
      relations: { menuItem: true },
    });

    return relations.map((relation) => relation.menuItem);
  }

  private async getParents(menuItemId: string): Promise<MenuItem[]> {
    const relations = await this.menuItemRelationRepository.find({
      where: { menuItemId },
      relations: { parent: true },
    });

    return relations.map((relation) => relation.parent);
  }
}
