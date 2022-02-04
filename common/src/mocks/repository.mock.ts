import { randomUUID } from "crypto";
import { IBase } from "src/interfaces";

const createEntity = (entity: IBase): IBase => ({
  ...entity,
  id: randomUUID(),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});

export const repositoryMock = {
  save: jest.fn((entity) => Promise.resolve(createEntity(entity))),

  create: jest.fn((entity) => createEntity(entity)),
};
