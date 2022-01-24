import { HttpStatus } from '@nestjs/common';
import { authenticate, request } from './setup';

describe('[GET] /api/users/current-user', () => {
  it('should return a 401 if the user is not authenticated', () => {
    return request
      .get('/api/users/current-user')
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('returns the user info for authenticated user', async () => {
    const credentials = {
      email: 'test@test.com',
      password: 'test',
    };

    await authenticate(credentials);

    return request
      .get('/api/users/current-user')
      .send({})
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('email', credentials.email);
        expect(res.body).not.toHaveProperty('password');
      });
  });
});
