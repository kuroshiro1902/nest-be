import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { Note } from '../entity/note.entity';
import { BaseService } from '@/modules/common/service/base.service';
import type { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { PageResult } from '@/modules/common/dto/pagination.model';
import { SearchNoteDto } from '../dto/search-note.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NoteService extends BaseService<Note> {
  constructor(@InjectRepository(Note) repository: Repository<Note>) {
    super(repository);
  }

  async createOne(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.repository.save(this.repository.create(createNoteDto));
  }

  async updateOne(userId: string, id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOneOrThrow({ where: { id, userId } });
    return this.repository.save(this.repository.merge(note, updateNoteDto));
  }

  async findOneOrThrow(options: FindOneOptions<Note>): Promise<Note> {
    const note = await this.repository.findOne(options);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async deleteOne(userId: string, id: string): Promise<void> {
    const note = await this.findOneOrThrow({ where: { id, userId } });
    await this.repository.softRemove(note);
  }

  async search(userId: string, searchInput: SearchNoteDto): Promise<PageResult<Note>> {
    const { search, ...pageInput } = searchInput;
    return this.paginate(pageInput, {
      where: { userId, title: search ? ILike(`%${search}%`) : undefined },
      relations: {
        notebook: true,
      },
    });
  }
}
