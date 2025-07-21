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
  extra: {
    // Force IPv4 connections and add timeout settings for cloud deployment
    connectionTimeoutMillis: 30000,
    query_timeout: 30000,
    statement_timeout: 30000,
    // Force IPv4 connections to avoid IPv6 connectivity issues in deployment
    family: 4,
  },
  // namingStrategy: new SnakeNamingStrategy(),
  logging: true,
};

export const typeOrmModuleOptions: TypeOrmModuleOptions = dataSourceOptions;

export const dataSource = new DataSource(dataSourceOptions);
