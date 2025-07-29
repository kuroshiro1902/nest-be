import { BaseEntity } from '@/modules/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'menu_items' })
export class MenuItem extends BaseEntity {
  @Column({ name: 'label', type: 'text' })
  label: string;

  @Column({ name: 'path', type: 'text', nullable: true })
  path: string | null;

  @Column({ name: 'icon', type: 'text', nullable: true })
  icon: string | null;

  @Column({ name: 'order', type: 'smallint', default: 0 })
  order: number;

  @OneToMany(() => MenuItemRelation, (relation) => relation.menuItem)
  parentRelations: MenuItemRelation[];

  @OneToMany(() => MenuItemRelation, (relation) => relation.parent)
  childRelations: MenuItemRelation[];

  // Virtual relations
  @OneToMany(() => MenuItem, () => null)
  children: MenuItem[];

  @OneToMany(() => MenuItem, () => null)
  parents: MenuItem[];
}

@Entity({ name: 'menu_item_relations' })
export class MenuItemRelation extends BaseEntity {
  @Column({ name: 'menu_item_id', type: 'uuid' })
  menuItemId: string;

  @Column({ name: 'parent_id', type: 'uuid' })
  parentId: string;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.parentRelations)
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.childRelations)
  @JoinColumn({ name: 'parent_id' })
  parent: MenuItem;
}
