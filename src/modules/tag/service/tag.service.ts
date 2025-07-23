import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { Tag, TTagUniqueCondition } from '../entity/tag.entity';
import { BaseService } from '@/modules/common/service/base.service';
import type { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { PageResult } from '@/modules/common/dto/pagination.model';
import { SearchTagDto } from '../dto/search-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService extends BaseService<Tag> {
  constructor(@InjectRepository(Tag) repository: Repository<Tag>) {
    super(repository);
  }

  async createOne(createTagDto: CreateTagDto): Promise<Tag> {
    // Generate slug từ name
    const slug = this.generateSlug(createTagDto.name);

    const uniqueCondition: TTagUniqueCondition = { slug, userId: createTagDto.userId };
    const existingTag = await this.exists({ where: uniqueCondition });
    if (existingTag) {
      throw new ConflictException('Tag đã tồn tại');
    }

    const newTag = this.repository.create({
      ...createTagDto,
      slug,
    });
    return this.repository.save(newTag);
  }

  async updateOne(userId: string, id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOneOrThrow({ where: { id, userId } });

    // Nếu có thay đổi name, generate slug mới
    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const newSlug = this.generateSlug(updateTagDto.name);

      const uniqueCondition: TTagUniqueCondition = { slug: newSlug, userId };
      const existingTag = await this.exists({ where: uniqueCondition });
      if (existingTag) {
        throw new ConflictException('Tag đã tồn tại');
      }

      return this.repository.save(this.repository.merge(tag, { ...updateTagDto, slug: newSlug }));
    }

    return this.repository.save(this.repository.merge(tag, updateTagDto));
  }

  async deleteOne(userId: string, id: string): Promise<void> {
    const tag = await this.findOneOrThrow({ where: { id, userId } });
    await this.repository.softRemove(tag);
  }

  async search(userId: string, searchTagDto: SearchTagDto): Promise<PageResult<Tag>> {
    const { search, ...pageInput } = searchTagDto;
    return this.paginate(pageInput, {
      where: {
        userId,
        name: search ? ILike(`%${search}%`) : undefined,
      },
    });
  }

  async findOneOrThrow(options: FindOneOptions<Tag>): Promise<Tag> {
    const tag = await this.repository.findOne(options);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async exists(options: FindOneOptions<Tag>): Promise<boolean> {
    return this.repository.exists(options);
  }

  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .trim()
        // Thay thế các ký tự đặc biệt và dấu cách bằng dấu gạch ngang
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        // Loại bỏ dấu gạch ngang ở đầu và cuối
        .replace(/^-+|-+$/g, '')
    );
  }
}
