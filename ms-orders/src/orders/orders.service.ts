import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Order } from './entities';
import { IOrder } from './order.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<IOrder>,
  ) {}

  /**
   * Returns all the orders.
   */
  async findAll(): Promise<IOrder[]> {
    return await this.repository.find();
  }

  /**
   * Creates and returns a new order with the given order data.
   */
  async create(orderData: IOrder): Promise<IOrder> {
    const order = this.repository.create(orderData);
    return await this.repository.save(order);
  }

  /**
   * Returns the order with the given id.
   *
   * @throws {EntityNotFound}
   */
  async findOne(
    id: IOrder['id'],
    options?: FindOneOptions<IOrder>,
  ): Promise<IOrder> {
    const user = await this.repository.findOne(id, options);
    if (!user) throw new EntityNotFound(this.repository);
    return user;
  }

  /**
   * Updates the order with the given id with given order data.
   */
  async update(
    id: IOrder['id'],
    orderData: QueryDeepPartialEntity<IOrder>,
  ): Promise<IOrder> {
    await this.repository.update(id, orderData);
    return await this.findOne(id);
  }

  /**
   * Removes the order with the given id.
   *
   * @throws {EntityNotFound}
   */
  async remove(id: IOrder['id']) {
    const { affected } = await this.repository.softDelete(id);
    if (!affected) {
      throw new EntityNotFound(this.repository);
    }
  }

  /**
   * Restores the order with the given id.
   *
   * @throws {EntityNotFound}
   */
  async restore(id: IOrder['id']) {
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
