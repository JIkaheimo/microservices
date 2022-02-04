import faker from '@faker-js/faker';
import { OrderStatus } from '@jikaheimo/common';
import { Factory, SubFactory } from '@linnify/typeorm-factory';
import { Order } from 'src/entities';
import { TicketFactory } from './ticket.factory';

export class OrderFactory extends Factory<Order> {
  entity = Order;

  expiresAt = faker.date.soon();
  ticket = new SubFactory(TicketFactory);
  status = OrderStatus.Created;
  userId = faker.datatype.uuid();
}
