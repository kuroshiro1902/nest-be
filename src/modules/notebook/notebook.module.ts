import { Module } from '@nestjs/common';
import { NotebookService } from './service/notebook.service';
import { NotebookController } from './controller/notebook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteBook } from './entity/notebook.entity';
import { NotebookTag } from './entity/notebook-tag.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoteBook, NotebookTag]), AuthModule],
  providers: [NotebookService],
  exports: [NotebookService],
  controllers: [NotebookController],
})
export class NotebookModule {}
