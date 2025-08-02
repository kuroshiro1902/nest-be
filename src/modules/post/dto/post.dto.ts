import { Post } from '../entity/post.entity';
import { TagDto, toTagDto } from '@/modules/tag/dto/tag.dto';

export type PostDto = Omit<Post, 'postTags'> & { tags: TagDto[] };

export const toPostDto = (post: Post): PostDto => {
  const { postTags, ...rest } = post;
  return {
    ...rest,
    tags: postTags.map((postTag) => toTagDto(postTag.tag)),
  };
};
