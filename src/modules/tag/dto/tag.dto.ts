import { Tag } from '../entity/tag.entity';

export type TagDto = Pick<Tag, 'name' | 'id' | 'slug'>;

export const toTagDto = (tag: Tag): TagDto => {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  };
};
