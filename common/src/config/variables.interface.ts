import { DatabaseConfig } from "./database/database.interface";
import { EnvConfig } from "./environment/env.interface";
import { JwtConfig } from "./jwt/jwt.interface";

export interface EnvironmentVariables {
  database: DatabaseConfig;
  jwt: JwtConfig;
  env: EnvConfig;
}
