import { NestFactory } from '@nestjs/core';
import { NatsOptions, Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.connectMicroservice<NatsOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['http://nats-srv:4222'],
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('Listening on port 3000');
}
bootstrap();
