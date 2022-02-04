import { Injectable } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Entity, getRepository, Repository } from "typeorm";
import { ConfigModule, DatabaseModule } from "../config";
import { BaseEntity } from "../entities";
import { EntityNotFound } from "../exceptions";
import { EntityCrudService } from "./entity-crud.service";

@Entity()
class SomeEntity extends BaseEntity {}

@Injectable()
class EntityService extends EntityCrudService<SomeEntity> {
  constructor(
    @InjectRepository(SomeEntity) repository: Repository<SomeEntity>
  ) {
    super(repository);
  }
}

describe("EntityCrudService", () => {
  let service: EntityCrudService<SomeEntity>;
  let repository: Repository<SomeEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([SomeEntity]),
        DatabaseModule.forRootAsync(),
      ],
      providers: [EntityService],
    }).compile();

    service = await module.resolve(EntityService);
    repository = await getRepository(SomeEntity);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await repository.clear();
  });

  describe("findAll()", () => {
    it("should return empty array if there is no entities", async () => {
      const entities = await service.findAll();
      expect(entities).toHaveLength(0);
    });

    it("should return all the entities", async () => {
      await repository.save([{}, {}, {}]);
      const entities = await service.findAll();
      expect(entities).toHaveLength(3);
    });

    it("should call the corresponding repository methods", async () => {
      const find = jest.spyOn(repository, "find");
      await service.findAll();
      expect(find).toHaveBeenCalledTimes(1);
    });
  });

  describe("create()", () => {
    it("should create and return a new entity", async () => {
      const entity = await service.create({});
      expect(entity).toHaveProperty("id");
      expect(entity).toHaveProperty("createdAt");
      expect(entity).toHaveProperty("updatedAt");
      expect(entity).toHaveProperty("deletedAt");
    });

    it("should call the corresponding repository methods", async () => {
      const save = jest.spyOn(repository, "save");
      const create = jest.spyOn(repository, "create");
      await service.create({});
      expect(save).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne()", () => {
    let entities: SomeEntity[];

    beforeAll(async () => {
      entities = await repository.save([{}, {}, {}]);
    });

    it.each([0, 1, 2])("should find entity in index %d", async (index) => {
      const findOne = jest.spyOn(repository, "findOne");

      const { id } = entities[index];
      const entity = await service.findOne(id);
      expect(entity).not.toBeNull();

      expect(findOne).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the entity cannot be found", async () => {
      const findOne = jest.spyOn(repository, "findOne");

      try {
        await service.findOne(randomUUID());
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotFound);
        expect(e).toHaveProperty(
          "message",
          "SomeEntity with the given id does not exist"
        );
      }

      expect(findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("update()", () => {
    it("should update the entity", async () => {
      const update = jest.spyOn(repository, "update");
      const entity = await service.create({});
      await service.update(entity.id, {});
      expect(update).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the entity cannot be found", async () => {
      const update = jest.spyOn(repository, "update");

      try {
        await service.update(randomUUID(), {});
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotFound);
        expect(e).toHaveProperty(
          "message",
          "SomeEntity with the given id does not exist"
        );
      }

      expect(update).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove()", () => {
    it("should remove the entity", async () => {
      const { id } = await repository.save({});
      await service.remove(id);
      const entity = await repository.findOne(id);
      expect(entity).toBeUndefined();
    });

    it("should only soft delete the entity", async () => {
      const { id } = await repository.save({});
      await service.remove(id);
      const entity = await repository.findOne(id, { withDeleted: true });
      expect(entity.deletedAt).not.toBeNull();
    });

    it("should throw an error if the entity cannot be found", async () => {
      try {
        await service.remove(randomUUID());
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotFound);
        expect(e).toHaveProperty(
          "message",
          "SomeEntity with the given id does not exist"
        );
      }
    });
  });

  describe("restore", () => {
    it("should restore soft deleted entity", async () => {
      const { id } = await repository.save({});
      await repository.softDelete(id);
      await service.restore(id);
      const entity = await repository.findOne(id);
      expect(entity).not.toBeUndefined();
    });

    it("should throw an error if the entity cannot be found", async () => {
      try {
        await service.restore(randomUUID());
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotFound);
        expect(e).toHaveProperty(
          "message",
          "SomeEntity with the given id does not exist"
        );
      }
    });
  });
});
