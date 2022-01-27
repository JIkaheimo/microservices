import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { getRepository } from "typeorm";

@ValidatorConstraint({ async: true })
export class UniqueOnDatabaseExistConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: any, args: ValidationArguments) {
    const { object, property } = args;
    const entity = object[`class_entity_${property}`];
    const manager = getRepository(entity);
    const count = await manager.count({ [property]: value });
    return count === 0;
  }
}

export const UniqueOnDatabase =
  (entity: unknown, options?: ValidationOptions) =>
  (object: unknown, propertyName: string) => {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: "$property already exists",
        ...options,
      },
      validator: UniqueOnDatabaseExistConstraint,
    });
  };
