import { ExecutionContext } from "@nestjs/common";
import { IUser } from "../interfaces";

interface IRequestParams {
  [key: string]: any;
}

interface IParams {
  params?: IRequestParams;
  user?: IUser;
}

export function createExecutionContextMock(contextParams: IParams) {
  const { params = {}, user = {} } = contextParams;
  return {
    getHandler: jest.fn,
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({ params, user })),
    })),
  } as unknown as ExecutionContext;
}
