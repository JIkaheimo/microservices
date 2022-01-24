import { HttpStatus } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { getRepository } from 'typeorm';
import { request } from './setup';

describe('[POST] /api/users/register', () => {
  it('returns a 201 on successful registration', () => {
    return request
      .post('/api/users/register')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .expect(HttpStatus.CREATED);
  });

  it('returns a 400 with an invalid email', () => {
    return request
      .post('/api/users/register')
      .send({
        email: 'test.com',
        password: 'test',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          email: ['Must be an email'],
        },
      });
  });

  it('returns a 400 with an invalid password', () => {
    return request
      .post('/api/users/register')
      .send({
        email: 'test@test.com',
        password: '123',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          password: ['Must be longer than or equal to 4 characters'],
        },
      });
  });

  it('returns a 400 with missing email and password', async () => {
    await request
      .post('/api/users/register')
      .send({})
      .expect(HttpStatus.BAD_REQUEST);

    await request
      .post('/api/users/register')
      .send({
        email: 'test@test.com',
      })
      .expect(HttpStatus.BAD_REQUEST);

    return request
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

    return request
      .post('/api/users/register')
      .send({
        email,
        password,
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          email: ['Already exists'],
        },
      });
  });

  it('sets a cookie after successful registration', async () => {
    const res = await request
      .post('/api/users/register')
      .send({
        email: 'test@test.com',
        password: 'test',
      })
      .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
