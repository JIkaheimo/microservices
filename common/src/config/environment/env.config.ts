import { registerAs } from "@nestjs/config";
import { Environment } from "./env.enum";
import { EnvConfig } from "./env.interface";
import { isTesting } from "./helpers";

export const envConfig = registerAs(
  "env",
  (): EnvConfig => ({
    isProduction: process.env.NODE_ENV === Environment.Production,
    isDevelopment: process.env.NODE_ENV === Environment.Development,
    isTesting: isTesting(),
  })
);
