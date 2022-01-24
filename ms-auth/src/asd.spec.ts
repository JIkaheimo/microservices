import { INestApplication } from '@nestjs/common';
import {
  ClientProxy,
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getConnection } from 'typeorm';
import { AppModule } from './app.module';
import { User } from './users/entities/user.entity';

describe('Auth Microservice', () => {
  let app: INestApplication;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          { name: 'clientToken', transport: Transport.TCP },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice<MicroserviceOptions>(
      { transport: Transport.TCP },
      { inheritAppConfig: true },
    );

    await app.startAllMicroservices();
    await app.init();
    client = app.get('clientToken');
    await client.connect();
  });

  const initDatabase = async () => {
    const connection = await getConnection();

    await connection.createQueryBuilder().delete().from(User).execute();

    return connection;
  };

  afterAll(async () => {
    await initDatabase();
    await app.close();
    await client.close();
  });

  describe('asd', () => {
    const userData = {
      email: 'test@asd.io',
      password: 'teasadad',
    };

    it('user cannot be created', (done) => {
      // try {
      // expect(

      const res = client.send('register', {
        password: userData.password,
      });

      res.subscribe((json) => {
        expect(json).toBe('asd');
        done();
      });

      //   ).toThrowError();
      //   const resNoEmail = await client
      //     .send('register', {
      //       password: userData.password,
      //     })
      //     .toPromise();
      //   console.log(resNoEmail);
      //   expect(resNoEmail.status).toBe(HttpStatus.BAD_REQUEST);
      //   expect(resNoEmail.body).toBe('asd');
      // } catch (error) {
      //   console.log(error);
      // }
    });
  });
});
