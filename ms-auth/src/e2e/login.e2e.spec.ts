import faker from '@faker-js/faker';
import { useTestApi, useTestApp, useTestDatabase } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { User } from 'src/users';
import { Repository } from 'typeorm';
import { RegistrationData } from '../authentication/dto/registration-data.dto';

describe('[POST] /api/users/login', () => {
  const { getApp } = useTestApp(AppModule);
  const { getRepository } = useTestDatabase({ useExisting: true });
  const { getApi } = useTestApi(getApp);

  let users: Repository<User>;

  beforeAll(async () => {
    users = await getRepository(User);
  });

  it('fails when an email that does not exist is supplied', () => {
    return getApi()
      .post('/api/users/login')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'message',
          'Invalid login credentials.',
        );
      });
  });

  it('fails when an invalid password is supplied', async () => {
    await users.save({
      email: 'test@test.com',
      password: faker.internet.password(),
    });

    return getApi()
      .post('/api/users/login')
      .send({
        email: 'test@test.com',
        password: faker.internet.password(),
      })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'message',
          'Invalid login credentials.',
        );
      });
  });

  it('responds with a cookie when given valid login credentials', async () => {
    const credentials: RegistrationData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = users.create(credentials);
    await users.save(user);

    return getApi()
      .post('/api/users/login')
      .send(credentials)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.get('Set-Cookie')).toBeDefined();
      });
  });
});
