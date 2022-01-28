import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";

export class EntityNotFound extends NotFoundException {
  constructor(repository: Repository<unknown>) {
    const { tableName } = repository.metadata;
    super(`${tableName} with the given id does not exist`);
  }
}
