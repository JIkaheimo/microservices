import { ITicket } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { Ticket } from 'src/tickets/entities';
import { getRepository } from 'typeorm';
import { authenticate, request, user } from './setup';

describe('[GET] /api/tickets', () => {
  it('has a route handler post requests', async () => {
    return request
      .get('/api/tickets')
      .send({})
      .expect((res) => {
        expect(res.notFound).toBeFalsy();
      });
  });

  it('is not accessible for unauthorized user', async () => {
    return request.get('/api/tickets').send({}).expect(HttpStatus.UNAUTHORIZED);
  });

  it('returns a list of tickets for authorized user', async () => {
    const ticketsData: ITicket[] = [
      {
        title: 'Test Title',
        price: 10,
        userId: user.id,
      },
      {
        title: 'Test Title 2',
        price: 20,
        userId: user.id,
      },
    ];

    const tickets = getRepository(Ticket);
    await tickets.insert(ticketsData);

    return (await authenticate())
      .get('/api/tickets')
      .send({})
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
      });
  });
});
