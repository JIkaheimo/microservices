import { ITicket, Subject } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UpdateTicketDto } from 'src/tickets/dto';
import { Ticket } from 'src/tickets/entities';
import { TicketsService } from 'src/tickets/tickets.service';
import { getRepository } from 'typeorm';
import { app, authenticate, MockPublisher, request, user } from './setup';

describe('[PUT] /api/tickets/:id', () => {
  let ticketsService: TicketsService;

  beforeAll(async () => {
    ticketsService = await app.resolve(TicketsService);
  });

  it('has a route handler post requests', async () => {
    return request
      .put(`/api/tickets/${randomUUID()}`)
      .send({})
      .expect((res) => {
        expect(res.notFound).toBeFalsy();
      });
  });

  it('is not accessible for unauthorized user', async () => {
    return request
      .put(`/api/tickets/${randomUUID()}`)
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('is accessible for authorized user', async () => {
    return (await authenticate())
      .put(`/api/tickets/${randomUUID()}`)
      .send({})
      .expect((res) => {
        expect(res.unauthorized).toBeFalsy();
      });
  });

  it('should return 404 if the ticket does not exist', async () => {
    return (await authenticate())
      .put(`/api/tickets/${randomUUID()}`)
      .send({
        title: 'Test Title',
        price: 10,
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('returns an error if invalid data is provided', async () => {
    const ticketData: ITicket = {
      title: 'Test Title',
      price: 10,
      userId: user.id,
    };

    const ticket = await ticketsService.create(ticketData);

    return (await authenticate())
      .put(`/api/tickets/${ticket.id}`)
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
  });

  it('returns 403 if the user is not authorized', async () => {
    const ticket = await ticketsService.create({
      title: 'Test Title',
      price: 10,
      userId: user.id,
    });

    return (
      await authenticate({
        id: randomUUID(),
        email: 'test@test.com',
      })
    )
      .put(`/api/tickets/${ticket.id}`)
      .send({
        title: 'Test Title',
        price: 10,
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('updates the ticket with valid data', async () => {
    const ticket = await ticketsService.create({
      title: 'Test Title',
      price: 10,
      userId: user.id,
    });

    const ticketData: UpdateTicketDto = {
      title: 'Another Test Title',
      price: 20,
    };

    return (await authenticate())
      .put(`/api/tickets/${ticket.id}`)
      .send(ticketData)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toMatchObject(ticketData);
      });
  });

  it('publishes ticket update event', async () => {
    const ticket = await ticketsService.create({
      title: 'Test Title',
      price: 10,
      userId: user.id,
    });

    const ticketData: UpdateTicketDto = {
      title: 'Another Test Title',
      price: 20,
    };

    await (await authenticate())
      .put(`/api/tickets/${ticket.id}`)
      .send(ticketData);

    const dbTicket = await getRepository(Ticket).findOne(ticket.id);

    expect(MockPublisher.emit).toHaveBeenCalledWith(
      Subject.TicketUpdated,
      dbTicket,
    );
    expect(MockPublisher.emit).toHaveBeenCalledTimes(1);
  });
});
