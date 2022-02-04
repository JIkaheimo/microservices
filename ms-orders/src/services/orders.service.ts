import { EntityCrudService, IUser, OrderStatus } from '@jikaheimo/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class OrdersService extends EntityCrudService<Order> {
  constructor(
    @InjectRepository(Order)
    readonly repository: Repository<Order>,
  ) {
    super(repository);
  }

  async create(creationData: DeepPartial<Order>): Promise<Order> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + Order.EXPIRATION_TIME);

    return super.create({
      ...creationData,
      status: OrderStatus.Created,
      expiresAt,
    });
  }

  async findForUser(userId: IUser['id']): Promise<Order[]> {
    return this.repository.find({ where: { userId } });
  }
}
