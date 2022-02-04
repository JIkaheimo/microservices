import { BaseEntity, IOrder, OrderStatus } from '@jikaheimo/common';
import { Expose } from 'class-transformer';
import { Ticket } from 'src/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Order extends BaseEntity implements IOrder {
  static readonly EXPIRATION_TIME: number = 15 * 60;

  @Column({ type: 'text', default: OrderStatus.Created })
  readonly status: OrderStatus;

  @Column()
  readonly ticketId: string;
  @ManyToOne(() => Ticket, (ticket) => ticket.orders, { eager: true })
  @JoinColumn()
  readonly ticket: Ticket;

  @Column()
  readonly userId: string;

  @Column({ nullable: true })
  readonly expiresAt: Date;

  @Expose()
  get isReserved(): boolean {
    return this.status !== OrderStatus.Cancelled;
  }
}
