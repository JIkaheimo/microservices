import { JwtStrategy } from '@jikaheimo/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities';
import { TicketEventsController } from './ticket-events.controller';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    ClientsModule.register([
      {
        name: 'TICKETING_NATS',
        transport: Transport.NATS,
        options: {
          servers: ['http://nats-srv:4222'],
          queue: 'tickets',
          debug: true,
          verbose: true,
        },
      },
    ]),
  ],
  controllers: [TicketsController, TicketEventsController],
  providers: [TicketsService, JwtStrategy],
  exports: [TicketsService, TypeOrmModule],
})
export class TicketsModule {}
