import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { IUser } from "src";
import * as supertest from "supertest";

const defaultUser: IUser = {
  id: randomUUID(),
  email: "test@test.com",
};

export const useTestApi = (app: () => INestApplication) => {
  let authenticatedUser: IUser = null;
  let api: supertest.SuperAgentTest;

  // Setup the api testing with supertest agent.
  beforeEach(() => {
    const application = app();
    api = supertest.agent(application.getHttpServer());
  });

  /**
   * Authenticates the given user to use some parts of the API.
   * @param {IUser} user The user authenticated.
   */
  const authenticate = async (user: IUser = defaultUser) => {
    const application = app();
    const jwt = await application.resolve(JwtService);
    const token = await jwt.signAsync(user);
    const cookie = `Authentication=${token}; Path=/`;
    api.set("Cookie", cookie);
    authenticatedUser = user;
    return api;
  };

  return {
    getApi: () => api,
    getUser: () => authenticatedUser,
    authenticate,
  };
};
