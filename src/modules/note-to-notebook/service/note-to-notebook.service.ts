import { Injectable } from '@nestjs/common';
import { NoteService } from '@/modules/note/service/note.service';
import { NotebookService } from '@/modules/notebook/service/notebook.service';
import { Note } from '@/modules/note/entity/note.entity';
import type { AddNoteToNotebookDto } from '../dto/add-note-to-notebook.dto';

@Injectable()
export class NoteToNotebookService {
  constructor(
    private readonly noteService: NoteService,
    private readonly notebookService: NotebookService,
  ) {}

  async addNoteToNotebook(userId: string, addNoteToNotebookInput: AddNoteToNotebookDto): Promise<Note> {
    const { noteId, notebookId } = addNoteToNotebookInput;
    const note = await this.noteService.findOneOrThrow({ where: { id: noteId, userId } });
    const notebook = await this.notebookService.findOneOrThrow({ where: { id: notebookId, userId } });
    note.notebook = notebook;
    return this.noteService.save(note);
  }
}
