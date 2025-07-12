import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { NoteToNotebookService } from '../service/note-to-notebook.service';
import { ZodBody } from '@/modules/common/decorators';
import { AddNoteToNotebookDto } from '../dto/add-note-to-notebook.dto';
import { Request } from 'express';
import { AuthTokenGuard } from '@/modules/auth/guard/auth-token.guard';

@Controller('note-to-notebook')
@UseGuards(AuthTokenGuard)
export class NoteToNotebookController {
  constructor(private readonly noteToNotebookService: NoteToNotebookService) {}

  @Post('add')
  @HttpCode(200)
  async addNoteToNotebook(
    @Req() req: Request,
    @ZodBody(AddNoteToNotebookDto) addNoteToNotebookInput: AddNoteToNotebookDto,
  ) {
    return this.noteToNotebookService.addNoteToNotebook(req.user.id, addNoteToNotebookInput);
  }
}
