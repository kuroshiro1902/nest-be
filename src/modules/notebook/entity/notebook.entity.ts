import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '@/modules/user/entity/user.entity';
import { BaseEntity } from '@/modules/common/entity/base.entity';
import { Note } from '@/modules/note/entity/note.entity';
import { NotebookTag } from './notebook-tag.entity';

export enum ENoteBookStatus {
  ACTIVE = 'active',
  TRASH = 'trash',
}

@Entity({ name: 'notebooks' })
export class NoteBook extends BaseEntity {
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'status', type: 'text', default: ENoteBookStatus.ACTIVE })
  status: ENoteBookStatus;

  @ManyToOne(() => User, (user) => user.notebooks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Note, (note) => note.notebook, {
    cascade: ['insert', 'update'],
  })
  notes: Note[];

  @OneToMany(() => NotebookTag, (notebookTag) => notebookTag.notebook, {
    cascade: ['insert', 'update'],
  })
  notebookTags: NotebookTag[];
}
