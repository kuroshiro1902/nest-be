import { Injectable } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { Note } from '../entity/note.entity';
import { BaseService } from '@/modules/common/service/base.service';
import type { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { PageResult } from '@/modules/common/dto/pagination.model';
import { SearchNoteDto } from '../dto/search-note.dto';

@Injectable()
export class NoteService extends BaseService<Note> {
  constructor(dataSource: DataSource) {
    super(Note, dataSource);
  }

  async createOne(userId: string, createNoteDto: CreateNoteDto, notebookId?: string): Promise<Note> {
    const newNote = this.create({ ...createNoteDto, userId, notebookId });
    return this.save(newNote);
  }

  async updateOne(userId: string, id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOneOrThrow({ where: { id, userId } });
    const updateNote = this.merge(note, updateNoteDto);
    return this.save(updateNote);
  }

  async deleteOne(userId: string, id: string): Promise<void> {
    await this.findOneOrThrow({ where: { id, userId } });
    await this.softDelete(id);
  }

  async search(userId: string, searchInput: SearchNoteDto): Promise<PageResult<Note>> {
    const { search, ...pageInput } = searchInput;
    return super.paginate(pageInput, {
      where: { userId, title: search ? ILike(`%${search}%`) : undefined },
      relations: {
        notebook: true,
      },
    });
  }
}
