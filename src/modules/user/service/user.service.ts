import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { BaseService } from '@/modules/common/service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  async createOne(user: CreateUserDto): Promise<User> {
    return this.repository.save(this.repository.create(user));
  }

  async exists(options: FindOneOptions<User>): Promise<boolean> {
    return this.repository.exists(options);
  }

  async findOneOrThrow(options: FindOneOptions<User>): Promise<User> {
    const user = await this.repository.findOne(options);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
