import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ENV } from '@/config/environment.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: ENV.DATABASE.HOST,
  port: ENV.DATABASE.PORT,
  username: ENV.DATABASE.USERNAME,
  password: ENV.DATABASE.PASSWORD,
  database: ENV.DATABASE.DB,
  schema: ENV.DATABASE.SCHEMA,
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*.ts')],
  migrationsTableName: 'migrations',
  synchronize: false,
  logger: 'file',
  logging: ['warn', 'error', 'query'],
};

export const connectionSource = new DataSource(dataSourceOptions);
