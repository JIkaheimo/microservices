import { BaseEntity, ITicket } from '@jikaheimo/common';
import { Column, Entity } from 'typeorm';

@Entity()
export class Ticket extends BaseEntity implements ITicket {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  userId: string;
}
