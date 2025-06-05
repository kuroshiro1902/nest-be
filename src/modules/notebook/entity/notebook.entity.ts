import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@/modules/user/entity/user.entity';
import { BaseEntity } from '@/modules/common/entity/base.entity';

@Entity({ name: 'notebooks' })
export class NoteBook extends BaseEntity {
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.notebooks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
