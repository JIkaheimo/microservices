import * as Joi from "joi";
import { Environment } from "./env.enum";

export const envConfigSchema = {
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default(Environment.Development),
};
