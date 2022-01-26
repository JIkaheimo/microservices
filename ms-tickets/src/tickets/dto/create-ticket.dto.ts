import { ITicket } from '@jikaheimo/common';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateTicketDto implements Omit<ITicket, 'userId'> {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsPositive()
  price: number;
}
