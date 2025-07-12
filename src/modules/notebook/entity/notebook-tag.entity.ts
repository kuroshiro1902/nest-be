import { Entity, Column, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { NoteBook } from './notebook.entity';
import { Tag } from '@/modules/tag/entity/tag.entity';
import { BaseEntity } from '@/modules/common/entity/base.entity';

@Entity({ name: 'notebook_tags' })
@Unique(['notebookId', 'tagId'])
export class NotebookTag extends BaseEntity {
  @Column({ name: 'notebook_id', type: 'uuid' })
  notebookId: string;

  @Column({ name: 'tag_id', type: 'uuid' })
  tagId: string;

  @ManyToOne(() => NoteBook, (notebook) => notebook.notebookTags, {
    cascade: true,
  })
  @JoinColumn({ name: 'notebook_id' })
  notebook: NoteBook;

  @ManyToOne(() => Tag, (tag) => tag.notebookTags, {
    cascade: true,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
