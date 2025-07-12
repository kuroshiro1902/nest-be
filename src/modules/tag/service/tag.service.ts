import { Injectable, ConflictException } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { Tag } from '../entity/tag.entity';
import { BaseService } from '@/modules/common/service/base.service';
import type { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { PageResult } from '@/modules/common/dto/pagination.model';
import { SearchTagDto } from '../dto/search-tag.dto';

@Injectable()
export class TagService extends BaseService<Tag> {
  constructor(dataSource: DataSource) {
    super(Tag, dataSource);
  }

  async createOne(userId: string, createTagDto: CreateTagDto): Promise<Tag> {
    // Generate slug từ name
    const slug = this.generateSlug(createTagDto.name);

    const existingTag = await this.existsBy({ slug });
    if (existingTag) {
      throw new ConflictException('Tag already exists');
    }

    const newTag = this.create({
      ...createTagDto,
      slug,
      createdByUserId: userId,
    });
    return this.save(newTag);
  }

  async updateOne(userId: string, id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOneOrThrow({ where: { id, createdByUserId: userId } });

    // Nếu có thay đổi name, generate slug mới
    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const newSlug = this.generateSlug(updateTagDto.name);

      const existingTag = await this.existsBy({ slug: newSlug });
      if (existingTag) {
        throw new ConflictException('Tag already exists');
      }

      const updateTag = this.merge(tag, { ...updateTagDto, slug: newSlug });
      return this.save(updateTag);
    }

    const updateTag = this.merge(tag, updateTagDto);
    return this.save(updateTag);
  }

  async deleteOne(userId: string, id: string): Promise<void> {
    await this.findOneOrThrow({ where: { id, createdByUserId: userId } });
    await this.softDelete(id);
  }

  async search(userId: string, searchTagDto: SearchTagDto): Promise<PageResult<Tag>> {
    const { search, ...pageInput } = searchTagDto;
    return super.paginate(pageInput, {
      where: {
        createdByUserId: userId,
        name: search ? ILike(`%${search}%`) : undefined,
      },
    });
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
