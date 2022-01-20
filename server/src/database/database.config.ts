import { registerAs } from '@nestjs/config';
import 'dotenv/config';
import * as Joi from 'joi';

const DEFAULT_DB_HOST = 'localhost';
const DEFAULT_DB_PORT = 3306;
const DEFAULT_DB_USERNAME = 'root';
const DEFAULT_DB_PASSWORD = '';
const DEFAULT_DB_NAME = 'test';

export interface DatabaseConfig {
  type: 'mysql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
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
    type: 'mysql',
    host: process.env.DB_HOST ?? DEFAULT_DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || DEFAULT_DB_PORT,
    username: process.env.DB_USERNAME ?? DEFAULT_DB_USERNAME,
    password: process.env.DB_PASSWORD ?? DEFAULT_DB_PASSWORD,
    database: process.env.DB_NAME ?? DEFAULT_DB_NAME,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
  }),
);
