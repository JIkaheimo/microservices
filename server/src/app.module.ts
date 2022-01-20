import {
  CacheInterceptor,
  CacheModule,
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CatsModule } from './cats/cats.module';
import { HttpExceptionFilter } from './common/filter';
import { LoggerMiddleware } from './common/middleware';
import {
  databaseConfig,
  databaseConfigSchema,
} from './database/database.config';
import { EnvironmentVariables } from './environment-variables.interface';
import { PhotosModule } from './photos/photos.module';
import { TasksModule } from './tasks/tasks.module';
import { RolesGuard } from './users/roles.guard';
import { UsersModule } from './users/users.module';

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
      ttl: 30,
      max: 20,
    }),
    ScheduleModule.forRoot(),
    CatsModule,

    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    UsersModule,
    PhotosModule,
    TasksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
