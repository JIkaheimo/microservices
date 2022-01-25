import { ConfigService } from "@nestjs/config";
import { JwtModule as BaseJwtModule, JwtModuleAsyncOptions } from "@nestjs/jwt";
import { EnvironmentVariables } from "./environment-variables.interface";

export class JwtModule extends BaseJwtModule {
  static registerAsync(options?: JwtModuleAsyncOptions) {
    return super.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<EnvironmentVariables>) => ({
        ...config.get("jwt"),
      }),
      ...options,
    });
  }
}
