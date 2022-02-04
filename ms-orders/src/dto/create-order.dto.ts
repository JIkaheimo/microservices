import { ExistsOnDatabase, ITicket } from '@jikaheimo/common';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Ticket } from 'src/entities';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  @ExistsOnDatabase(Ticket)
  ticketId: ITicket['id'];
}
