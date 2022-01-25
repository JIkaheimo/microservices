import { ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { EnvironmentVariables } from "./environment-variables.interface";

export class DatabaseModule extends TypeOrmModule {
  static forRootAsync(options?: TypeOrmModuleAsyncOptions) {
    return super.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables>) => ({
        ...config.get("database"),
        autoLoadEntities: true,
      }),
      ...options,
    });
  }
}
