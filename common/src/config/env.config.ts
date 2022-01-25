import { registerAs } from '@nestjs/config';
import 'dotenv/config';
import * as Joi from 'joi';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export interface EnvConfig {
  isProduction: boolean;
  isDevelopment: boolean;
  isTesting: boolean;
}

export const isTesting = () => process.env.NODE_ENV === Environment.Test;

export const envConfigSchema = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default(Environment.Development),
};

export const envConfig = registerAs(
  'env',
  (): EnvConfig => ({
    isProduction: process.env.NODE_ENV === Environment.Production,
    isDevelopment: process.env.NODE_ENV === Environment.Development,
    isTesting: isTesting(),
  }),
);
