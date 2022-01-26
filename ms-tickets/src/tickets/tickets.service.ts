import { ITicket } from '@jikaheimo/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Ticket } from './entities';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repository: Repository<ITicket>,
  ) {}

  /**
   * Returns all the tickets.
   */
  async findAll(): Promise<ITicket[]> {
    return await this.repository.find();
  }

  /**
   * Creates and returns a new with the given user data.
   */
  async create(ticketData: ITicket): Promise<ITicket> {
    const ticket = this.repository.create(ticketData);
    return await this.repository.save(ticket);
  }

  /**
   * Returns the user with the given id.
   *
   * @throws {EntityNotFound}
   */
  async findOne(
    id: ITicket['id'],
    options?: FindOneOptions<ITicket>,
  ): Promise<ITicket> {
    const user = await this.repository.findOne(id, options);
    if (!user) throw new EntityNotFound(this.repository);
    return user;
  }

  /**
   * Updates the ticket with the given id with given ticket data.
   */
  async update(
    id: ITicket['id'],
    ticketData: QueryDeepPartialEntity<ITicket>,
  ): Promise<ITicket> {
    await this.repository.update(id, ticketData);
    return await this.findOne(id);
  }

  /**
   * Removes the ticket with the given id.
   *
   * @throws {EntityNotFound}
   */
  async remove(id: ITicket['id']) {
    const { affected } = await this.repository.softDelete(id);
    if (!affected) {
      throw new EntityNotFound(this.repository);
    }
  }

  /**
   * Restores the ticket with the given id.
   *
   * @throws {EntityNotFound}
   */
  async restore(id: ITicket['id']) {
    const { affected } = await this.repository.restore(id);
    if (!affected) {
      throw new EntityNotFound(this.repository);
    }
  }
}

export class EntityNotFound extends NotFoundException {
  constructor(repository: Repository<unknown>) {
    const { tableName } = repository.metadata;
    super(`${tableName} with the given id does not exist`);
  }
}
