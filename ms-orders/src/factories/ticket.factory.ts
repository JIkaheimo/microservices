import faker from '@faker-js/faker';
import { Factory } from '@linnify/typeorm-factory';
import { Ticket } from 'src/entities';

export class TicketFactory extends Factory<Ticket> {
  entity = Ticket;

  title = faker.commerce.productName();
  price = faker.datatype.float({ precision: 2, min: 0 });
}
