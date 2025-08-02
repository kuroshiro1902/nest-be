import { BaseEntity } from '@/modules/common/entity/base.entity';
import { User } from '@/modules/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PostTag } from './post-tag.entity';

@Entity()
export class Post extends BaseEntity {
  @Column({ name: 'title', type: 'text', nullable: false })
  title: string;

  @Column({ name: 'slug', type: 'text', nullable: false })
  slug: string;

  @Column({
    name: 'uid',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  uid: string;

  @Column({ name: 'content', type: 'text', nullable: false })
  content: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ name: 'views', type: 'int', default: 0 })
  views: number;

  @Column({ name: 'votes', type: 'int', default: 0 })
  votes: number;

  @Column({ name: 'point', type: 'float', default: 0 })
  point: number;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string | null;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => PostTag, (postTag) => postTag.post, {
    cascade: ['insert', 'update'],
  })
  postTags: PostTag[];
}
