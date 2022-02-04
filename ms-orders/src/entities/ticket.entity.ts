import { BaseEntity, ITicket } from '@jikaheimo/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Ticket extends BaseEntity implements Omit<ITicket, 'userId'> {
  @Column({ nullable: false })
  readonly title: string;

  @Column({ nullable: false })
  readonly price: number;

  @OneToMany(() => Order, (order) => order.ticket)
  readonly orders: Promise<Order[]>;

  async isReserved(): Promise<boolean> {
    const orders = await this.orders;
    return orders.some((order) => order.isReserved);
  }
}
