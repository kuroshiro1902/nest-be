import { Module } from '@nestjs/common';
import { NoteToNotebookService } from './service/note-to-notebook.service';
import { NoteToNotebookController } from './controller/note-to-notebook.controller';
import { NoteModule } from '../note/note.module';
import { NotebookModule } from '../notebook/notebook.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [NoteModule, NotebookModule, AuthModule],
  providers: [NoteToNotebookService],
  controllers: [NoteToNotebookController],
})
export class NoteToNotebookModule {}
