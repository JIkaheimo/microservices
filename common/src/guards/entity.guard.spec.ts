import { ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { Column, Entity, EntityTarget } from "typeorm";
import { BaseEntity } from "../entities";
import { EntityNotFound } from "../exceptions";
import { createExecutionContextMock } from "../mocks";
import { useTestDatabase } from "../testing";
import { EntityGuard } from "./entity.guard";

@Entity()
class PublicEntity extends BaseEntity {}

@Entity()
class PrivateEntity extends BaseEntity {
  @Column()
  userId: string;
}

const setup = (entity: EntityTarget<unknown>) => {
  let guard: EntityGuard;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [EntityGuard],
    })
      .overrideProvider(Reflector)
      .useValue({ get: () => entity })
      .compile();

    guard = await module.resolve(EntityGuard);
  });

  return {
    getGuard: () => guard,
  };
};

describe("EntityGuard", () => {
  const { getRepository } = useTestDatabase({
    entities: [PublicEntity, PrivateEntity],
    useExisting: false,
  });

  describe("for 'public' entity route", () => {
    const { getGuard } = setup(PublicEntity);

    it("should return true if there is no entity id param", async () => {
      const canActivate = await getGuard().canActivate(
        createExecutionContextMock({})
      );
      expect(canActivate).toBeTruthy();
    });

    it("should return true if the entity exists", async () => {
      const { id } = await getRepository(PublicEntity).save({});

      const canActivate = await getGuard().canActivate(
        createExecutionContextMock({ params: { id } })
      );
      expect(canActivate).toBeTruthy();
    });

    it("should throw an error if the entity does not exist", async () => {
      const canActivate = getGuard().canActivate(
        createExecutionContextMock({ params: { id: randomUUID() } })
      );
      const reject = expect(canActivate).rejects;

      await reject.toThrow(EntityNotFound);
      await reject.toHaveProperty(
        "message",
        "PublicEntity with the given id does not exist"
      );
    });
  });

  describe("for 'private' entity route", () => {
    const { getGuard } = setup(PrivateEntity);

    it("should return true if there is no entity id param", async () => {
      const canActivate = await getGuard().canActivate(
        createExecutionContextMock({})
      );
      expect(canActivate).toBeTruthy();
    });

    it("should throw an error if the entity does not exist", async () => {
      const canActivate = getGuard().canActivate(
        createExecutionContextMock({ params: { id: randomUUID() } })
      );
      const reject = expect(canActivate).rejects;

      await reject.toThrow(EntityNotFound);
      await reject.toHaveProperty(
        "message",
        "PrivateEntity with the given id does not exist"
      );
    });

    it("should throw an error if the user does not own the entity", async () => {
      const { id } = await getRepository(PrivateEntity).save({
        userId: randomUUID(),
      });

      const canActivate = getGuard().canActivate(
        createExecutionContextMock({
          params: { id },
          user: { id: randomUUID(), email: "asd" },
        })
      );

      const reject = expect(canActivate).rejects;

      await reject.toThrow(ForbiddenException);
    });

    it("should return true if the user owns the entity", async () => {
      const userId = randomUUID();

      const { id } = await getRepository(PrivateEntity).save({
        userId,
      });

      const canActivate = await getGuard().canActivate(
        createExecutionContextMock({
          params: { id },
          user: { id: userId, email: "asd" },
        })
      );

      expect(canActivate).toBeTruthy();
    });
  });
});
