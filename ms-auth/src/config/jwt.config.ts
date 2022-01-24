import { registerAs } from '@nestjs/config';
import 'dotenv/config';
import * as Joi from 'joi';

const DEFAULT_JWT_SECRET = '[secret]';

export interface JwtConfig {
  /** The secret used to sign JWTs.  */
  secret: string;
}

export const jwtConfigSchema = {
  JWT_SECRET: Joi.string().default(DEFAULT_JWT_SECRET),
};

export const jwtConfig = registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET,
  }),
);
