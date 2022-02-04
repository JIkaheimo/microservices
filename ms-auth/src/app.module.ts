import {
  ConfigModule,
  DatabaseModule,
  ValidationPipe,
} from '@jikaheimo/common';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthenticationModule } from 'src/modules/authentication.module';
import { UsersModule } from 'src/modules/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRootAsync(),
    UsersModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
