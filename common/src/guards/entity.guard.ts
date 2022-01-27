import { IUser } from "src/interfaces";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { EntityTarget, getRepository } from "typeorm";
import { ENTITY_KEY } from "src/private";

@Injectable()
export class EntityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const target = this.reflector.get<EntityTarget<{ userId: IUser["id"] }>>(
      ENTITY_KEY,
      context.getHandler()
    );

    const request = context.switchToHttp().getRequest();
    const { params, user } = request;
    const { id } = params;

    const repository = getRepository(target);
    const entity = await repository.findOne(id);

    if (!entity) {
      throw new NotFoundException();
    }

    if (entity.userId !== user.id) {
      throw new ForbiddenException();
    }

    request.entity = entity;

    return true;
  }
}
