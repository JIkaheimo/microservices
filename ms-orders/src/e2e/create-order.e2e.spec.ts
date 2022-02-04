import {
  OrderStatus,
  publisherMock,
  useTestApi,
  useTestApp,
  useTestDatabase,
} from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AppModule } from 'src/app.module';
import { Order } from 'src/entities';
import { OrderFactory, TicketFactory } from 'src/factories';
import { getRepository } from 'typeorm';

describe('[POST] /api/orders', () => {
  const { getApp } = useTestApp(AppModule);
  useTestDatabase({ useExisting: true });
  const { authenticate, getApi } = useTestApi(getApp);

  let orderFactory: OrderFactory;
  let ticketFactory: TicketFactory;

  beforeAll(async () => {
    orderFactory = new OrderFactory();
    ticketFactory = new TicketFactory();
  });

  it('has a route handler for creating an order', async () => {
    return getApi()
      .post('/api/orders')
      .send({})
      .expect((res) => {
        expect(res.notFound).toBeFalsy();
      });
  });

  it('is not accessible for visitors', async () => {
    return getApi()
      .post('/api/orders')
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('is accessible for authenticated user', async () => {
    return (await authenticate())
      .post('/api/orders')
      .send({})
      .expect((res) => {
        expect(res.unauthorized).toBeFalsy();
      });
  });

  it('returns an error if the ticket does not exist', async () => {
    return (await authenticate())
      .post('/api/orders')
      .send({
        ticketId: randomUUID(),
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        errors: {
          ticketId: ['TicketId does not exist'],
        },
      });
  });

  it('returns an error if the ticket is already reserved', async () => {
    const order = await orderFactory.create();

    return (await authenticate())
      .post('/api/orders')
      .send({
        ticketId: order.ticketId,
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Ticket is already reserved!',
        error: 'Bad Request',
      });
  });

  it('reserves a ticket', async () => {
    const ticket = await ticketFactory.create();

    return (await authenticate())
      .post('/api/orders')
      .send({
        ticketId: ticket.id,
      })
      .expect(HttpStatus.CREATED)
      .expect(({ body: order }) => {
        expect(order).toHaveProperty('status', OrderStatus.Created);
        expect(order).toHaveProperty('ticketId', ticket.id);
      });
  });

  it('publishes order creation event', async () => {
    const ticket = await ticketFactory.create();

    const { body: order } = await (await authenticate())
      .post('/api/orders')
      .send({ ticketId: ticket.id });

    const dbOrder = await getRepository(Order).findOne(order.id);

    expect(publisherMock.emit).toHaveBeenCalledWith('order:created', dbOrder);
    expect(publisherMock.emit).toHaveBeenCalledTimes(1);
  });
});
