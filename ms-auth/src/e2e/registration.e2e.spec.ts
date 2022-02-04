import { useTestApi, useTestApp, useTestDatabase } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { User } from 'src/entities';
import { getRepository } from 'typeorm';

describe('[POST] /api/users/register', () => {
  const { getApp } = useTestApp(AppModule);
  useTestDatabase({ useExisting: true });
  const { getApi } = useTestApi(getApp);

  it('returns a 201 on successful registration', () => {
    return getApi()
      .post('/api/users/register')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .expect(HttpStatus.CREATED);
  });

  it('returns a 400 with an invalid email', () => {
    return getApi()
      .post('/api/users/register')
      .send({
        email: 'test.com',
        password: 'test',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          email: ['Email must be an email'],
        },
      });
  });

  it('returns a 400 with an invalid password', () => {
    return getApi()
      .post('/api/users/register')
      .send({
        email: 'test@test.com',
        password: '123',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          password: ['Password must be longer than or equal to 4 characters'],
        },
      });
  });

  it('returns a 400 with missing email and password', async () => {
    await getApi()
      .post('/api/users/register')
      .send({})
      .expect(HttpStatus.BAD_REQUEST);

    await getApi()
      .post('/api/users/register')
      .send({
        email: 'test@test.com',
      })
      .expect(HttpStatus.BAD_REQUEST);

    return getApi()
      .post('/api/users/register')
      .send({
        password: 'test',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('returns a 400 if the email has already been taken', async () => {
    const email = 'test@test.com';
    const password = 'test';
    await getRepository(User).save({ email, password });

    return getApi()
      .post('/api/users/register')
      .send({
        email,
        password,
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          email: ['Email is already in use'],
        },
      });
  });

  it('sets a cookie after successful registration', async () => {
    const res = await getApi()
      .post('/api/users/register')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
