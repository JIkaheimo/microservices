import { HttpStatus } from '@nestjs/common';
import { RegistrationData } from '../authentication/dto/registration-data.dto';
import { UsersService } from '../users/users.service';
import { app, request } from './setup';

describe('[POST] /api/users/login', () => {
  it('fails when an email that does not exist is supplied', () => {
    return request
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
    await app.get(UsersService).create({
      email: 'test@test.com',
      password: 'password',
    });

    return request
      .post('/api/users/login')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword',
      })
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'message',
          'Invalid login credentials.',
        );
      });
  });

  it('responds with a cookie when given valid login credentials', async () => {
    const credentials: RegistrationData = {
      email: 'test@test.com',
      password: 'password',
    };

    await app.get(UsersService).create(credentials);

    return request
      .post('/api/users/login')
      .send(credentials)
      .expect(200)
      .expect((res) => {
        expect(res.get('Set-Cookie')).toBeDefined();
      });
  });
});
