import { registerAs } from "@nestjs/config";
import { isTesting } from "../helpers";
import { DatabaseConfig } from "./database.interface";
import {
  DEFAULT_MYSQL_DB_NAME,
  DEFAULT_MYSQL_HOST,
  DEFAULT_MYSQL_PASSWORD,
  DEFAULT_MYSQL_PORT,
  DEFAULT_MYSQL_USERNAME,
} from "./defaults";

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
