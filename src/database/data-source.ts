import 'dotenv/config';
import { DataSource, DataSourceOptions, DatabaseType } from 'typeorm';
import { Address } from './entities/address.entity';
import { Customer } from './entities/customer.entity';
import { User } from './entities/user.entity';
import { Warehouse } from './entities/warehouse.entity';

const type = process.env.TYPEORM_CONNECTION as DatabaseType as any; // Sometimes TS sucks
const host = process.env.TYPEORM_HOST;
const port = +process.env.TYPEORM_PORT;
const database = process.env.TYPEORM_DATABASE;
const username = process.env.TYPEORM_USERNAME;
const password = process.env.TYPEORM_PASSWORD;

const options: DataSourceOptions = {
  type,
  host,
  port,
  username,
  password,
  database,
  entities: [
    Address,
    Customer,
    User,
    Warehouse
  ],
  migrations: ['./src/database/migrations/*.ts'],
  synchronize: false,
  logging: false,
  ssl: process.env.SSL_CERT
    ? {
      ca: process.env.SSL_CERT?.replace(/\\n/g, '\n'),
    }
    : false,
};

export const dataSource = new DataSource(options);