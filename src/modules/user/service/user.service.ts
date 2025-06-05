import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';
import { BaseService } from '@/modules/common/service/base.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
}
