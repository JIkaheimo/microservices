import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { isTesting } from "./env.config";

const DEFAULT_MYSQL_HOST = "localhost";
const DEFAULT_MYSQL_PORT = 3306;
const DEFAULT_MYSQL_USERNAME = "root";
const DEFAULT_MYSQL_PASSWORD = "root";
const DEFAULT_MYSQL_DB_NAME = isTesting() ? ":memory:" : "test";

export interface DatabaseConfig {
  type: "mysql" | "better-sqlite3";
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
  MYSQL_HOST: Joi.string().default(DEFAULT_MYSQL_HOST),
  MYSQL_PORT: Joi.string().default(DEFAULT_MYSQL_PORT),
  MYSQL_USERNAME: Joi.string().default(DEFAULT_MYSQL_USERNAME),
  MYSQL_PASSWORD: Joi.string().default(DEFAULT_MYSQL_PASSWORD),
  MYSQL_DB_NAME: Joi.string().default(DEFAULT_MYSQL_DB_NAME),
};

export const databaseConfig = registerAs(
  "database",
  (): DatabaseConfig => ({
    type: isTesting() ? "better-sqlite3" : "mysql",
    host: process.env.MYSQL_HOST ?? DEFAULT_MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10) || DEFAULT_MYSQL_PORT,
    username: process.env.MYSQL_USERNAME ?? DEFAULT_MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD ?? DEFAULT_MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME ?? DEFAULT_MYSQL_DB_NAME,
    synchronize: process.env.NODE_ENV !== "production",
    logging: false,
    dropSchema: isTesting(),
  })
);
