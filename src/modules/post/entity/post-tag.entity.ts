import { BaseEntity } from '@/modules/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { Tag } from '@/modules/tag/entity/tag.entity';

@Entity()
export class PostTag extends BaseEntity {
  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @Column({ name: 'tag_id', type: 'uuid' })
  tagId: string;

  @ManyToOne(() => Post, (post) => post.postTags, {
    cascade: true,
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags, {
    cascade: true,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
