import { HttpStatus } from '@nestjs/common';
import { authenticate, request } from './setup';

describe('[POST] /api/users/logout', () => {
  it('clears the cookie after logout', async () => {
    await authenticate();

    await request
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
