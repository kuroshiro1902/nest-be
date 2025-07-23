import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NoteTag } from '../entity/note-tag.entity';
import { BaseService } from '@/modules/common/service/base.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NoteTagService extends BaseService<NoteTag> {
  constructor(@InjectRepository(NoteTag) repository: Repository<NoteTag>) {
    super(repository);
  }
}
