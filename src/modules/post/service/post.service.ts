import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@/modules/common/service/base.service';
import { Post } from '../entity/post.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';
import { type PostDto, toPostDto } from '../dto/post.dto';
import slugify from 'slugify';

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(@InjectRepository(Post) repository: Repository<Post>) {
    super(repository);
  }

  async getPostBySlug(slug: string): Promise<PostDto> {
    const uid = slug.split('-').pop();
    if (!uid) {
      throw new NotFoundException('Post not found');
    }
    const post = await this.repository.findOne({
      where: { uid },
      relations: { postTags: { tag: true } },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return toPostDto(post);
  }

  async findOneOrThrow(options: FindOneOptions<Post>): Promise<Post> {
    const post = await this.repository.findOne(options);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  private async generateUid(): Promise<string> {
    const uid = crypto.randomBytes(8).toString('hex');
    const exists = await this.repository.exists({
      where: { uid },
      withDeleted: true,
    });
    if (exists) {
      return this.generateUid();
    }
    return uid;
  }

  private generateSlug(title: string, uid: string): string {
    return (
      slugify(title, {
        lower: true,
        strict: true, // chỉ giữ lại a-z0-9 và gạch ngang
        locale: 'vi', // Chuẩn hóa Unicode tiếng Việt
        trim: true,
      }) + `-${uid}`
    );
  }
}
