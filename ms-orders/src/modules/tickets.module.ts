import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/entities';
import { TicketsService } from 'src/services';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  providers: [TicketsService],
  exports: [TicketsService, TypeOrmModule],
})
export class TicketsModule {}
