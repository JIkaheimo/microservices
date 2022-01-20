import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { HttpExceptionFilter } from './common/filter';
import { LoggerMiddleware } from './common/middleware';
import {
  databaseConfig,
  databaseConfigSchema,
} from './database/database.config';
import { EnvironmentVariables } from './environment-variables.interface';
import { PhotosModule } from './photos/photos.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [databaseConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        ...databaseConfigSchema,
      }),
      expandVariables: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables>) => ({
        ...config.get('database'),
        autoLoadEntities: true,
      }),
    }),
    CacheModule.register({
      store: redisStore,
      // Store-specific configuration:
      host: 'localhost',
      port: 6379,
    }),
    CatsModule,

    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    UsersModule,
    PhotosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
          target: true,
          value: true,
        },
        disableErrorMessages: false,
      }),
    },
    UsersService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
