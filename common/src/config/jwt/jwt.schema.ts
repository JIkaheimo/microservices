import * as Joi from "joi";
import { DEFAULT_JWT_SECRET } from "./defaults";

export const jwtConfigSchema = {
  JWT_SECRET: Joi.string().default(DEFAULT_JWT_SECRET),
};
