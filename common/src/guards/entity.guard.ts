import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { EntityTarget, getRepository } from "typeorm";
import { EntityNotFound } from "../exceptions";
import { IUser } from "../interfaces";
import { ENTITY_KEY } from "../private";

@Injectable()
export class EntityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const entityTarget = this.reflector.get<
      EntityTarget<{ userId?: IUser["id"] }>
    >(ENTITY_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const { params, user } = request;
    const { id } = params;

    // In case this is no entity-related route guard.
    if (id === undefined) {
      return true;
    }

    const repository = getRepository(entityTarget);
    const entity = await repository.findOne(id);

    if (!entity) {
      throw new EntityNotFound(repository);
    }

    // In case the entity does not have user id.
    if (!entity.userId) {
      return true;
    }

    if (entity.userId !== user.id) {
      throw new ForbiddenException();
    }

    request.entity = entity;

    return true;
  }
}
