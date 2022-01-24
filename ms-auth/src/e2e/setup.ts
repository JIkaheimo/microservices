import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { AppModule } from 'src/app.module';
import { RegistrationData } from 'src/authentication/dto/registration-data.dto';
import * as supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';

let app: INestApplication;
let request: supertest.SuperAgentTest;
let connection: Connection;

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.use(cookieParser());
  await app.init();
  connection = getConnection();
  request = supertest.agent(app.getHttpServer());
});

afterEach(async () => {
  await connection.dropDatabase();
  await connection.synchronize();
});

afterAll(async () => {
  await connection.close();
  await app.close();
});

export const authenticate = async (user?: RegistrationData) => {
  user = user ?? {
    email: 'test@test.com',
    password: 'password',
  };

  return await request.post('/api/users/register').send(user).expect(201);
};

export { app, request };
