import faker from '@faker-js/faker';
import { Factory } from '@linnify/typeorm-factory';
import { User } from 'src/entities';

export class UserFactory extends Factory<User> {
  entity = User;

  email = faker.internet.email();
  password = faker.internet.password();
}
