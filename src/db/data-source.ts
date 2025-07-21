import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
  entities: ['dist/**/*.entity.js'],
  ssl: { rejectUnauthorized: false },
  // namingStrategy: new SnakeNamingStrategy(),
  logging: true,
};

export const typeOrmModuleOptions: TypeOrmModuleOptions = dataSourceOptions;

export const dataSource = new DataSource(dataSourceOptions);
