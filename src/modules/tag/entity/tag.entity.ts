import { BaseEntity } from '@/modules/common/entity/base.entity';
import { User } from '@/modules/user/entity/user.entity';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { NotebookTag } from '@/modules/notebook/entity/notebook-tag.entity';
import { NoteTag } from '@/modules/note/entity/note-tag.entity';

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'slug', type: 'text', unique: true })
  slug: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdByUserId?: string | null;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'created_by' })
  createdBy?: User | null;

  @OneToMany(() => NotebookTag, (notebookTag) => notebookTag.tag, {
    cascade: ['insert', 'update'],
  })
  notebookTags: NotebookTag[];

  @OneToMany(() => NoteTag, (noteTag) => noteTag.tag, {
    cascade: ['insert', 'update'],
  })
  noteTags: NoteTag[];
}
