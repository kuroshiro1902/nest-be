import { Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { NoteService } from '../service/note.service';
import { ZodBody, ZodQuery } from '@/modules/common/decorators';
import { CreateNoteDto } from '../dto/create-note.dto';
import { Request } from 'express';
import { SearchNoteDto } from '../dto/search-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async createOne(@Req() req: Request, @ZodBody(CreateNoteDto) createNoteInput: CreateNoteDto) {
    return this.noteService.createOne(req.user.id, createNoteInput);
  }

  @Get('search')
  async search(@Req() req: Request, @ZodQuery(SearchNoteDto) searchNoteInput: SearchNoteDto) {
    return this.noteService.search(req.user.id, searchNoteInput);
  }

  @Get(':id')
  async getOne(@Req() req: Request, @Param('id') id: string) {
    return this.noteService.findOneOrThrow({ where: { userId: req.user.id, id } });
  }

  @Patch(':id')
  async updateOne(
    @Req() req: Request,
    @Param('id') id: string,
    @ZodBody(UpdateNoteDto) updateNoteInput: UpdateNoteDto,
  ) {
    return this.noteService.updateOne(req.user.id, id, updateNoteInput);
  }

  @Delete(':id')
  async deleteOne(@Req() req: Request, @Param('id') id: string) {
    return this.noteService.deleteOne(req.user.id, id);
  }
}
