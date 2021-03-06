import {
  ConfigModule as BaseConfigModule,
  ConfigModuleOptions,
} from "@nestjs/config";
import * as Joi from "joi";
import { databaseConfig, databaseConfigSchema } from "./database";
import { envConfig, envConfigSchema } from "./environment";
import { jwtConfig, jwtConfigSchema } from "./jwt";

export class ConfigModule extends BaseConfigModule {
  static forRoot(options?: ConfigModuleOptions) {
    return super.forRoot({
      cache: true,
      load: [databaseConfig, jwtConfig, envConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        ...databaseConfigSchema,
        ...jwtConfigSchema,
        ...envConfigSchema,
      }),
      expandVariables: true,
      validationOptions: {
        abortEarly: true,
      },
      ...options,
    });
  }
}
