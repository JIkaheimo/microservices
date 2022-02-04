import { useTestApi, useTestApp, useTestDatabase } from '@jikaheimo/common';
import { HttpStatus } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { OrderFactory } from 'src/factories';

describe('[GET] /api/orders', () => {
  const orderFactory = new OrderFactory();
  const { getApp } = useTestApp(AppModule);
  useTestDatabase({ useExisting: true });
  const { authenticate, getUser, getApi } = useTestApi(getApp);

  it('has a route handler for getting orders', async () => {
    return getApi()
      .get('/api/orders')
      .send({})
      .expect((res) => {
        expect(res.notFound).toBeFalsy();
      });
  });

  it('is not accessible for visitors', async () => {
    return getApi().get('/api/orders').send({}).expect(HttpStatus.UNAUTHORIZED);
  });

  it('is accessible for authenticated user', async () => {
    return (await authenticate())
      .get('/api/orders')
      .send({})
      .expect((res) => {
        expect(res.unauthorized).toBeFalsy();
      });
  });

  it('returns a list of orders of the authorized user', async () => {
    await orderFactory.create();

    const firstOrder = await orderFactory.create({
      userId: getUser().id,
    });

    const secondOrder = await orderFactory.create({
      userId: getUser().id,
    });

    return (await authenticate())
      .get('/api/orders')
      .send({})
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);

        const [first, second] = body;

        expect(first.id).toEqual(firstOrder.id);
        expect(second.id).toEqual(secondOrder.id);

        expect(first.ticket.id).toEqual(firstOrder.ticket.id);
        expect(second.ticket.id).toEqual(secondOrder.ticket.id);
      });
  });
});
