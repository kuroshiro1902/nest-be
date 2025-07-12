import { BaseEntity } from '@/modules/common/entity/base.entity';
import { User } from '@/modules/user/entity/user.entity';
import { NoteBook } from '@/modules/notebook/entity/notebook.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { NoteTag } from './note-tag.entity';

@Entity()
export class Note extends BaseEntity {
  @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
  title?: string | null;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'content', type: 'text', default: '' })
  content: string;

  @Column({ name: 'notebook_id', type: 'uuid', nullable: true })
  notebookId?: string | null;

  @ManyToOne(() => NoteBook, (notebook) => notebook.notes)
  @JoinColumn({ name: 'notebook_id' })
  notebook?: NoteBook | null;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => NoteTag, (noteTag) => noteTag.note, {
    cascade: ['insert', 'update'],
  })
  noteTags: NoteTag[];
}
