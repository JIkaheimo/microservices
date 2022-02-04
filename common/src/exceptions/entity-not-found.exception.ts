import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";

export class EntityNotFound extends NotFoundException {
  constructor(repository: Repository<unknown>) {
    const { name } = repository.metadata;
    super(`${name} with the given id does not exist`);
  }
}
