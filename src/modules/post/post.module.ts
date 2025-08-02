import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostTag } from './entity/post-tag.entity';
import { PostController } from './controller/post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostTag])],
  providers: [PostService],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}
