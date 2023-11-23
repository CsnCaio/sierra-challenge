import 'dotenv/config';
import { DataSource, DataSourceOptions, DatabaseType } from 'typeorm';
import { Address } from './entities/address.entity';
import { Customer } from './entities/customer.entity';
import { User } from './entities/user.entity';
import { Warehouse } from './entities/warehouse.entity';
import { ConfigDatabase1700705114476 } from './migrations/1700705114476-config-database';
import { SeedDatabase1700705123208 } from './migrations/1700705123208-seed-database';
import { ChangeAddressFields1700709979621 } from './migrations/1700709979621-change-address-fields';

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
  migrations: [ConfigDatabase1700705114476, SeedDatabase1700705123208, ChangeAddressFields1700709979621],
  synchronize: false,
  logging: false,
  ssl: process.env.SSL_CERT
    ? {
      ca: process.env.SSL_CERT?.replace(/\\n/g, '\n'),
    }
    : false,
};

export const dataSource = new DataSource(options);
