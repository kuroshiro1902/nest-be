import { Injectable } from '@nestjs/common';
import { type CreateNotebookDto } from '../dto/create-notebook.dto';
import { type SearchNotebookDto } from '../dto/search-notebook.dto';
import { type UpdateNoteBookDto } from '../dto/update-notebook.dto';
import { NoteBook } from '../entity/notebook.entity';
import { DataSource, ILike } from 'typeorm';
import { BaseService } from '@/modules/common/service/base.service';
import { PageResult } from '@/modules/common/dto/pagination.model';

@Injectable()
export class NotebookService extends BaseService<NoteBook> {
  constructor(dataSource: DataSource) {
    super(NoteBook, dataSource);
  }

  async createOne(userId: string, createNotebookDto: CreateNotebookDto): Promise<NoteBook> {
    return this.save({ userId, ...createNotebookDto });
  }

  async updateOne(userId: string, notebookId: string, updateNotebookDto: UpdateNoteBookDto): Promise<NoteBook> {
    const notebook = await this.findOneOrThrow({ where: { id: notebookId, userId } });
    return this.save({ ...notebook, ...updateNotebookDto });
  }

  async deleteOne(userId: string, notebookId: string): Promise<void> {
    const where = { id: notebookId, userId };
    await this.findOneOrThrow({ where });
    await this.softDelete(notebookId);
  }

  async search(userId: string, searchInput: SearchNotebookDto): Promise<PageResult<NoteBook>> {
    const { search, ...pageInput } = searchInput;
    return super.paginate(pageInput, { where: { userId, title: search ? ILike(`%${search}%`) : undefined } });
  }
}
