import { JwtModule, JwtStrategy } from '@jikaheimo/common';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import { AppModule } from 'src/app.module';
import * as supertest from 'supertest';
import { Connection, getConnection } from 'typeorm';

let app: INestApplication;
let request: supertest.SuperAgentTest;
let connection: Connection;

export const user = {
  id: randomUUID(),
  email: 'test@test.com',
};

export const authenticate = async (
  userData = user,
): Promise<supertest.SuperAgentTest> => {
  const jwt = await app.resolve(JwtService);
  const token = await jwt.signAsync(userData);
  const cookie = `Authentication=${token}; Path=/`;
  request.set('Cookie', cookie);
  return request;
};

export const MockPublisher = {
  emit: jest
    .fn()
    .mockImplementation((subject: string, payload: any) => payload),
};

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule, JwtModule.registerAsync()],
    providers: [JwtStrategy],
  })
    .overrideProvider('TICKETING_NATS')
    .useValue(MockPublisher)
    .compile();

  app = moduleFixture.createNestApplication();
  app.use(cookieParser());
  await app.init();

  connection = getConnection();
});

beforeEach(() => {
  jest.clearAllMocks();
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

export { app, request };
