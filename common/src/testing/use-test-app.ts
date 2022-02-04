import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as cookieParser from "cookie-parser";
import { JwtModule } from "../config";
import { publisherMock } from "../mocks";
import { JwtStrategy } from "../strategies";

export const useTestApp = (module: any) => {
  let app: INestApplication;

  // Setup the testing module (or app).
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [module, JwtModule.registerAsync()],
      providers: [JwtStrategy],
    })
      .overrideProvider("TICKETING_NATS")
      .useValue(publisherMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  // Make sure the app gets closed gracefully.
  afterAll(async () => {
    await app.close();
  });

  /**
   * Returns the application once it has been set up.
   * @returns Test application.
   */
  const getApp = () => {
    if (!app) throw "Test application uninitialized!";
    return app;
  };

  return {
    getApp,
  };
};
