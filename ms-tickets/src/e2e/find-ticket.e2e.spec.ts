import { ITicket } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TicketsService } from 'src/tickets/tickets.service';
import { app, authenticate, request, user } from './setup';

describe('[GET] /api/tickets/:id', () => {
  let ticketsService: TicketsService;

  beforeAll(async () => {
    ticketsService = await app.resolve(TicketsService);
  });

  it('has a route handler post requests', async () => {
    return request
      .get(`/api/tickets/${randomUUID()}`)
      .send({})
      .expect((res) => {
        expect(res.notFound).toBeFalsy();
      });
  });

  it('is not accessible for unauthorized user', async () => {
    return request
      .get(`/api/tickets/${randomUUID()}`)
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('is accessible for authorized user', async () => {
    return (await authenticate())
      .get(`/api/tickets/${randomUUID()}`)
      .send({})
      .expect((res) => {
        expect(res.unauthorized).toBeFalsy();
      });
  });

  it('should return 404 if the ticket does not exist', async () => {
    return (await authenticate())
      .get(`/api/tickets/${randomUUID()}`)
      .send({})
      .expect(HttpStatus.NOT_FOUND);
  });

  it('returns the ticket if the ticket is found', async () => {
    const ticketData: ITicket = {
      title: 'Test Title',
      price: 10,
      userId: user.id,
    };

    const ticket = await ticketsService.create(ticketData);

    (await authenticate())
      .get(`/api/tickets/${ticket.id}`)
      .expect(HttpStatus.OK)
      .expect(async ({ body }) => {
        expect(body).toMatchObject(ticket);
        expect(body).toMatchObject(ticketData);
      });
  });
});
