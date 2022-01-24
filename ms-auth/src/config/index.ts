import {
  ConfigModule as BaseConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import { JwtModule as BaseJwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import {
  databaseConfig,
  DatabaseConfig,
  databaseConfigSchema,
} from './database.config';
import { EnvConfig, envConfig, envConfigSchema } from './env.config';
import { jwtConfig, JwtConfig, jwtConfigSchema } from './jwt.config';

export interface EnvironmentVariables {
  database: DatabaseConfig;
  jwt: JwtConfig;
  env: EnvConfig;
}

export class DatabaseModule extends TypeOrmModule {
  static forRootAsync(options?: TypeOrmModuleAsyncOptions) {
    return super.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables>) => ({
        ...config.get('database'),
        autoLoadEntities: true,
      }),
      ...options,
    });
  }
}

export class JwtModule extends BaseJwtModule {
  static registerAsync(options?: JwtModuleAsyncOptions) {
    return super.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<EnvironmentVariables>) => ({
        ...config.get('jwt'),
      }),
      ...options,
    });
  }
}

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
