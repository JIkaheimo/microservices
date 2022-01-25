import * as Joi from "joi";
import {
  DEFAULT_MYSQL_DB_NAME,
  DEFAULT_MYSQL_HOST,
  DEFAULT_MYSQL_PASSWORD,
  DEFAULT_MYSQL_PORT,
  DEFAULT_MYSQL_USERNAME,
} from "./defaults";

export const databaseConfigSchema = {
  MYSQL_HOST: Joi.string().default(DEFAULT_MYSQL_HOST),
  MYSQL_PORT: Joi.string().default(DEFAULT_MYSQL_PORT),
  MYSQL_USERNAME: Joi.string().default(DEFAULT_MYSQL_USERNAME),
  MYSQL_PASSWORD: Joi.string().default(DEFAULT_MYSQL_PASSWORD),
  MYSQL_DB_NAME: Joi.string().default(DEFAULT_MYSQL_DB_NAME),
};
