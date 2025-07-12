import { Injectable } from '@nestjs/common';
import { type CreateNotebookDto } from '../dto/create-notebook.dto';
import { type SearchNotebookDto } from '../dto/search-notebook.dto';
import { type UpdateNoteBookDto } from '../dto/update-notebook.dto';
import { ENoteBookStatus, NoteBook } from '../entity/notebook.entity';
import { DataSource, ILike } from 'typeorm';
import { BaseService } from '@/modules/common/service/base.service';
import { PageResult } from '@/modules/common/dto/pagination.model';

@Injectable()
export class NotebookService extends BaseService<NoteBook> {
  constructor(dataSource: DataSource) {
    super(NoteBook, dataSource);
  }

  async createOne(userId: string, createNotebookDto: CreateNotebookDto): Promise<NoteBook> {
    const newNotebook = this.create({ userId, ...createNotebookDto, status: ENoteBookStatus.ACTIVE });
    return this.save(newNotebook);
  }

  async updateOne(userId: string, id: string, updateNotebookDto: UpdateNoteBookDto): Promise<NoteBook> {
    const notebook = await this.findOneOrThrow({ where: { id, userId } });
    const updateNotebook = this.merge(notebook, updateNotebookDto);
    return this.save(updateNotebook);
  }

  async deleteOne(userId: string, id: string): Promise<void> {
    const where = { id, userId };
    await this.findOneOrThrow({ where });
    await this.softDelete(id);
  }

  async search(userId: string, searchInput: SearchNotebookDto): Promise<PageResult<NoteBook>> {
    const { search, ...pageInput } = searchInput;
    return super.paginate(pageInput, { where: { userId, title: search ? ILike(`%${search}%`) : undefined } });
  }
}
