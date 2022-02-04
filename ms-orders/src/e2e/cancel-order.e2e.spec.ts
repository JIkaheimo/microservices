import {
  OrderStatus,
  useTestApi,
  useTestApp,
  useTestDatabase,
} from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AppModule } from 'src/app.module';
import { OrderFactory } from 'src/factories';

describe('[POST] /api/orders/:id/cancel', () => {
  const { getApp } = useTestApp(AppModule);
  useTestDatabase({ useExisting: true });
  const { authenticate, getUser, getApi } = useTestApi(getApp);

  let orderFactory: OrderFactory;

  beforeAll(() => {
    orderFactory = new OrderFactory();
  });

  it('has a route handler for cancelling an order', async () => {
    return getApi()
      .post(`/api/orders/${randomUUID()}/cancel`)
      .send({})
      .expect((res) => {
        expect(res.notFound).toBeFalsy();
      });
  });

  it('is not accessible for visitors', async () => {
    return getApi()
      .post(`/api/orders/${randomUUID()}/cancel`)
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('is accessible for authenticated user', async () => {
    return (await authenticate())
      .post(`/api/orders/${randomUUID()}/cancel`)
      .send({})
      .expect((res) => {
        expect(res.unauthorized).toBeFalsy();
      });
  });

  it('is not accessible for unauthorized users', async () => {
    const order = await orderFactory.create();

    return (await authenticate())
      .post(`/api/orders/${order.id}/cancel`)
      .send({})
      .expect(HttpStatus.FORBIDDEN);
  });

  it('cancels an order of the authorized user', async () => {
    const order = await orderFactory.create({ userId: getUser().id });

    return (await authenticate())
      .post(`/api/orders/${order.id}/cancel`)
      .send({})
      .expect(HttpStatus.OK)
      .expect(({ body: order }) => {
        expect(order).toHaveProperty('status', OrderStatus.Cancelled);
      });
  });
});
