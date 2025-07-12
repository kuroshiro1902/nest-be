import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NoteTag } from '../entity/note-tag.entity';
import { BaseService } from '@/modules/common/service/base.service';

@Injectable()
export class NoteTagService extends BaseService<NoteTag> {
  constructor(dataSource: DataSource) {
    super(NoteTag, dataSource);
  }
}
