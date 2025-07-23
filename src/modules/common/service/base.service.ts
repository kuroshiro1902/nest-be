import { BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsOrder, Repository, EntityTarget, DataSource } from 'typeorm';
import { BaseEntity } from '../entity/base.entity';
import { PageInputDto, PageResult } from '../dto/pagination.model';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async paginate(
    pageInput: PageInputDto<T>,
    options?: Pick<FindManyOptions<T>, 'where' | 'relations' | 'select'>,
  ): Promise<PageResult<T>> {
    const { page, limit, sort = 'createdAt', order = 'DESC' }: PageInputDto<T> = pageInput;
    const skip = (page - 1) * limit;
    const orderBy = { [sort]: order } as FindOptionsOrder<T>;
    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      order: orderBy,
      where: options?.where,
      relations: options?.relations,
      select: options?.select,
    });
    return {
      data,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // async transaction<T>(
  //   callback: (queryRunner: QueryRunner) => Promise<T>,
  //   queryRunner: QueryRunner,
  //   options: {
  //     logger?: Logger;
  //   },
  // ): Promise<T> {
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const result = await callback(queryRunner);
  //     await queryRunner.commitTransaction();
  //     return result;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     options.logger?.error('Lỗi khi thực hiện transaction: ' + error?.message, error?.stack);
  //     throw new InternalServerErrorException('Không thể thực hiện transaction.');
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
