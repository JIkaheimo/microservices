import { Injectable } from "@nestjs/common";
import { IBase } from "src";
import { EntityNotFound } from "src/exceptions";
import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export abstract class EntityCrudService<Entity extends IBase> {
  protected readonly repository: Repository<Entity>;

  /**
   * Returns all the items from the given repository.
   */
  async findAll(): Promise<Entity[]> {
    return await this.repository.find();
  }

  /**
   * Creates and returns a new with the given user data.
   */
  async create(creationData: DeepPartial<Entity>): Promise<Entity> {
    return await this.repository.save(creationData);
  }

  /**
   * Returns the user with the given id.
   *
   * @throws {EntityNotFound}
   */
  async findOne(
    id: Entity["id"],
    options?: FindOneOptions<Entity>
  ): Promise<Entity> {
    const user = await this.repository.findOne(id, options);
    if (!user) throw new EntityNotFound(this.repository);
    return user;
  }

  /**
   * Updates the ticket with the given id with given ticket data.
   */
  async update(
    id: Entity["id"],
    ticketData: QueryDeepPartialEntity<Entity>
  ): Promise<Entity> {
    await this.repository.update(id, ticketData);
    return await this.findOne(id);
  }

  /**
   * Removes the ticket with the given id.
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
   * Restores the ticket with the given id.
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
