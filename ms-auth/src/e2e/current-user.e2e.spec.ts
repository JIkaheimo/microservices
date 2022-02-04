import { useTestApi, useTestApp, useTestDatabase } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { UserFactory } from 'src/factories';

describe('[GET] /api/users/current-user', () => {
  const userFactory = new UserFactory();
  const { getApp } = useTestApp(AppModule);
  useTestDatabase({ useExisting: true });
  const { getApi, authenticate } = useTestApi(getApp);

  it('should return a 401 if the user is not authenticated', () => {
    return getApi()
      .get('/api/users/current-user')
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('returns the user info for authenticated user', async () => {
    const user = await userFactory.create();
    await authenticate(JSON.parse(JSON.stringify(user)));

    return getApi()
      .get('/api/users/current-user')
      .send({})
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('email', user.email);
        expect(res.body).not.toHaveProperty('password');
      });
  });
});
