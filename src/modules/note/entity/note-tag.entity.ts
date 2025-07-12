import { Entity, Column, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Note } from './note.entity';
import { Tag } from '@/modules/tag/entity/tag.entity';
import { BaseEntity } from '@/modules/common/entity/base.entity';

@Entity({ name: 'note_tags' })
@Unique(['noteId', 'tagId'])
export class NoteTag extends BaseEntity {
  @Column({ name: 'note_id', type: 'uuid' })
  noteId: string;

  @Column({ name: 'tag_id', type: 'uuid' })
  tagId: string;

  @ManyToOne(() => Note, (note) => note.noteTags, {
    cascade: true,
  })
  @JoinColumn({ name: 'note_id' })
  note: Note;

  @ManyToOne(() => Tag, (tag) => tag.noteTags, {
    cascade: true,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
