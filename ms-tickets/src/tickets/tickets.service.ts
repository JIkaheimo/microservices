import { ITicket } from '@jikaheimo/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTicketDto } from './dto';
import { Ticket } from './entities';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repository: Repository<ITicket>,
  ) {}

  async create(ticketData: ITicket): Promise<ITicket> {
    const ticket = this.repository.create(ticketData);
    return await this.repository.save(ticket);
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
