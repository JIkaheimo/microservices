import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseEntity } from "../entities";
import { EntityNotFound } from "../exceptions";

export abstract class EntityCrudService<Entity extends BaseEntity> {
  constructor(protected readonly repository: Repository<Entity>) {}

  /**
   * Returns all the entities.
   */
  async findAll(options?: FindManyOptions<Entity>) {
    return await this.repository.find(options);
  }

  /**
   * Creates and returns a new entity with the given entity data.
   */
  async create(
    partialEntity: DeepPartial<Entity>,
    options?: SaveOptions
  ): Promise<Entity> {
    const entity = this.repository.create(partialEntity);
    return await this.repository.save(entity as any, options);
  }

  /**
   * Returns the entity with the given id.
   * Throws an error if the entity does not exist.
   *
   * @throws {EntityNotFound}
   */
  async findOne(id: Entity["id"], options?: FindOneOptions<Entity>) {
    const entity = await this.repository.findOne(id, options);
    if (!entity) throw new EntityNotFound(this.repository);
    return entity;
  }

  /**
   * Updates the entity with the given id with partial entity data.
   * Throws an error if the entity does not exist.
   *
   * @throws {EntityNotFound}
   */
  async update(
    id: Entity["id"],
    partialEntity: QueryDeepPartialEntity<Entity>
  ) {
    await this.repository.update(id, partialEntity);
    return await this.findOne(id);
  }

  /**
   * Removes the entity with the given id.
   * Throws an error if entity with the given id does not exist.
   *
   * @throws {EntityNotFound}
   */
  async remove(id: Entity["id"]) {
    const { affected } = await this.repository.softDelete(id);
    if (!affected) {
      throw new EntityNotFound(this.repository);
    }
  }

  /**
   * Restores the entity with the given id.
   * Throws an error if entity with the given id does not exist.
   *
   * @throws {EntityNotFound}
   */
  async restore(id: Entity["id"]) {
    const { affected } = await this.repository.restore(id);
    if (!affected) {
      throw new EntityNotFound(this.repository);
    }
  }
}
