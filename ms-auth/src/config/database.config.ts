import { registerAs } from '@nestjs/config';
import 'dotenv/config';
import * as Joi from 'joi';
import { isTesting } from './env.config';

const DEFAULT_DB_HOST = 'auth-mysql-srv';
const DEFAULT_DB_PORT = 3306;
const DEFAULT_DB_USERNAME = 'root';
const DEFAULT_DB_PASSWORD = 'root';
const DEFAULT_DB_NAME = isTesting() ? ':memory:' : 'test';

export interface DatabaseConfig {
  type: 'mysql' | 'better-sqlite3';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  dropSchema: boolean;
}

export const databaseConfigSchema = {
  DB_HOST: Joi.string().default(DEFAULT_DB_HOST),
  DB_PORT: Joi.number().default(DEFAULT_DB_PORT),
  DB_USERNAME: Joi.string().default(DEFAULT_DB_USERNAME),
  DB_PASSWORD: Joi.string().default(DEFAULT_DB_PASSWORD),
  DB_NAME: Joi.string().default(DEFAULT_DB_NAME),
};

export const databaseConfig = registerAs(
  'database',
  (): DatabaseConfig => ({
    type: isTesting() ? 'better-sqlite3' : 'mysql',
    host: process.env.DB_HOST ?? DEFAULT_DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || DEFAULT_DB_PORT,
    username: process.env.DB_USERNAME ?? DEFAULT_DB_USERNAME,
    password: process.env.DB_PASSWORD ?? DEFAULT_DB_PASSWORD,
    database: process.env.DB_NAME ?? DEFAULT_DB_NAME,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
    dropSchema: isTesting(),
  }),
);
