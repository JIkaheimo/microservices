import { SetMetadata } from "@nestjs/common";
import { IUser } from "src/interfaces";
import { EntityTarget } from "typeorm";
import { ENTITY_KEY } from "src/private";

export const CanModifyEntity = (
  entity: EntityTarget<{ userId: IUser["id"] }>
) => SetMetadata(ENTITY_KEY, entity);
