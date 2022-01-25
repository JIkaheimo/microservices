import { DatabaseConfig } from "./database.config";
import { EnvConfig } from "./env.config";
import { JwtConfig } from "./jwt.config";

export interface EnvironmentVariables {
  database: DatabaseConfig;
  jwt: JwtConfig;
  env: EnvConfig;
}
