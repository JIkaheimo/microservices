import { EntityCrudService } from '@jikaheimo/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities';

@Injectable()
export class TicketsService extends EntityCrudService<Ticket> {
  constructor(
    @InjectRepository(Ticket)
    readonly repository: Repository<Ticket>,
  ) {
    super(repository);
  }
}
