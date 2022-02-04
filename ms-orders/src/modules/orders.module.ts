import { JwtStrategy } from '@jikaheimo/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from 'src/controllers';
import { Order } from 'src/entities';
import { OrdersService } from 'src/services';
import { TicketsModule } from './tickets.module';

@Module({
  imports: [
    TicketsModule,
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: 'TICKETING_NATS',
        transport: Transport.NATS,
        options: {
          servers: ['http://nats-srv:4222'],
          queue: 'orders',
          debug: true,
          verbose: true,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtStrategy],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
