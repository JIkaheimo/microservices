import faker from '@faker-js/faker';
import { useTestApi, useTestApp, useTestDatabase } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { RegistrationData } from 'src/dto';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

describe('[POST] /api/users/logout', () => {
  const { getApp } = useTestApp(AppModule);
  const { getRepository } = useTestDatabase({ useExisting: true });
  const { authenticate, getApi } = useTestApi(getApp);

  let users: Repository<User>;

  beforeAll(async () => {
    users = await getRepository(User);
  });

  it('fails when the user is not authenticated', () => {
    return getApi()
      .post('/api/users/logout')
      .send()
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('clears the cookie after logout', async () => {
    const credentials: RegistrationData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await users.save(credentials);

    return (await authenticate(credentials))
      .post('/api/users/logout')
      .send()
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.get('Set-Cookie')).toContain(
          'Authentication=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        );
      });
  });
});
