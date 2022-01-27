import { ITicket, Subject } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { Ticket } from 'src/tickets/entities';
import { getRepository } from 'typeorm';
import { authenticate, MockPublisher, request, user } from './setup';

describe('[POST] /api/tickets', () => {
  it('has a route handler post requests', async () => {
    return request
      .post('/api/tickets')
      .send({})
      .expect((res) => {
        expect(res.notFound).toBeFalsy();
      });
  });

  it('is not accessible for unauthorized user', async () => {
    return request
      .post('/api/tickets')
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('is accessible for authorized user', async () => {
    return (await authenticate())
      .post('/api/tickets')
      .send({})
      .expect((res) => {
        expect(res.unauthorized).toBeFalsy();
      });
  });
  it('returns an error if invalid title is provided', async () => {
    const client = await authenticate();

    await client
      .post('/api/tickets')
      .send({
        title: '',
        price: 10,
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          title: ['Title should not be empty'],
        },
      });

    return client
      .post('/api/tickets')
      .send({
        price: 10,
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          title: ['Title should not be empty', 'Title must be a string'],
        },
      });
  });

  it('returns an error if invalid price is provided', async () => {
    const client = await authenticate();

    await client
      .post('/api/tickets')
      .send({
        title: 'Test Title',
        price: -10,
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          price: ['Price must be a positive number'],
        },
      });

    return client
      .post('/api/tickets')
      .send({
        title: 'Test Title',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          price: ['Price must be a positive number'],
        },
      });
  });

  it('creates a new ticket for valid data', async () => {
    const ticket: Omit<ITicket, 'userId'> = {
      title: 'Test Title',
      price: 20,
    };

    return (await authenticate())
      .post('/api/tickets')
      .send(ticket)
      .expect(HttpStatus.CREATED)
      .expect(async ({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body).toMatchObject(ticket);
        const dbTicket = await getRepository(Ticket).findOne(body.id);
        expect(dbTicket).toMatchObject(ticket);
        expect(dbTicket).toHaveProperty('userId', user.id);
      });
  });

  it('publishes ticket creation event', async () => {
    const ticketData: Omit<ITicket, 'userId'> = {
      title: 'Test Title',
      price: 20,
    };

    const { body: ticket } = await (await authenticate())
      .post('/api/tickets')
      .send(ticketData);

    const dbTicket = await getRepository(Ticket).findOne(ticket.id);

    expect(MockPublisher.emit).toHaveBeenCalledWith(
      Subject.TicketCreated,
      dbTicket,
    );
    expect(MockPublisher.emit).toHaveBeenCalledTimes(1);
  });
});
