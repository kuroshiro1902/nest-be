import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ObjectLiteral } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity implements ObjectLiteral {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @ApiProperty({ example: '1' })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  @ApiProperty({ example: '2024-01-01 00:00:00' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  @ApiProperty({ example: '2024-01-01 00:00:00' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  @ApiProperty({ example: '2024-01-01 00:00:00' })
  deletedAt: Date | null;
}
