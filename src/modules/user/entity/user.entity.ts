import { NoteBook } from '@/modules/notebook/entity/notebook.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/modules/common/entity/base.entity';
import { Note } from '@/modules/note/entity/note.entity';
import { Tag } from '@/modules/tag/entity/tag.entity';
import { Post } from '@/modules/post/entity/post.entity';

export enum EUserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'username', type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ name: 'password', type: 'text' })
  password: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true, nullable: true })
  email: string | null;

  @Column({ name: 'dob', type: 'varchar', length: 10, nullable: true })
  dob: string | null;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string | null;

  @Column({ name: 'bg_url', type: 'text', nullable: true })
  bgUrl: string | null;

  @Column({ name: 'role', type: 'varchar', length: 50, default: EUserRole.USER })
  role: EUserRole;

  @OneToMany(() => NoteBook, (notebook) => notebook.user, {
    cascade: ['insert', 'update'],
  })
  notebooks: NoteBook[];

  @OneToMany(() => Note, (note) => note.user, {
    cascade: ['insert', 'update'],
  })
  notes: Note[];

  @OneToMany(() => Tag, (tag) => tag.user, {
    cascade: ['insert', 'update'],
  })
  tags: Tag[];

  @OneToMany(() => Post, (post) => post.user, {
    cascade: ['insert', 'update'],
  })
  posts: Post[];
}
