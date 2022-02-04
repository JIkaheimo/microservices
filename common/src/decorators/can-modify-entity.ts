import { SetMetadata } from "@nestjs/common";
import { EntityTarget } from "typeorm";
import { IUser } from "../interfaces";
import { ENTITY_KEY } from "../private";

export const CanModifyEntity = (
  entity: EntityTarget<{ userId: IUser["id"] }>
) => SetMetadata(ENTITY_KEY, entity);
