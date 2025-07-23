import { Injectable, NotFoundException } from '@nestjs/common';
import { type CreateNotebookDto } from '../dto/create-notebook.dto';
import { type SearchNotebookDto } from '../dto/search-notebook.dto';
import { type UpdateNoteBookDto } from '../dto/update-notebook.dto';
import { ENoteBookStatus, NoteBook } from '../entity/notebook.entity';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { BaseService } from '@/modules/common/service/base.service';
import { PageResult } from '@/modules/common/dto/pagination.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotebookService extends BaseService<NoteBook> {
  constructor(@InjectRepository(NoteBook) repository: Repository<NoteBook>) {
    super(repository);
  }

  async createOne(createNotebookDto: CreateNotebookDto): Promise<NoteBook> {
    return this.repository.save(this.repository.create({ ...createNotebookDto, status: ENoteBookStatus.ACTIVE }));
  }

  async updateOne(userId: string, id: string, updateNotebookDto: UpdateNoteBookDto): Promise<NoteBook> {
    const notebook = await this.findOneOrThrow({ where: { id, userId } });
    return this.repository.save(this.repository.merge(notebook, updateNotebookDto));
  }

  async findOneOrThrow(options: FindOneOptions<NoteBook>): Promise<NoteBook> {
    const notebook = await this.repository.findOne(options);
    if (!notebook) {
      throw new NotFoundException('Notebook not found');
    }
    return notebook;
  }

  async deleteOne(userId: string, id: string): Promise<void> {
    const notebook = await this.findOneOrThrow({ where: { id, userId } });
    await this.repository.softRemove(notebook);
  }

  async search(userId: string, searchInput: SearchNotebookDto): Promise<PageResult<NoteBook>> {
    const { search, ...pageInput } = searchInput;
    return this.paginate(pageInput, { where: { userId, title: search ? ILike(`%${search}%`) : undefined } });
  }
}
