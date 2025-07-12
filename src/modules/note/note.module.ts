import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entity/note.entity';
import { NoteTag } from './entity/note-tag.entity';
import { NoteController } from './controller/note.controller';
import { NoteService } from './service/note.service';
import { NoteTagService } from './service/note-tag.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note, NoteTag]), AuthModule],
  controllers: [NoteController],
  providers: [NoteService, NoteTagService],
  exports: [NoteService, NoteTagService],
})
export class NoteModule {}
