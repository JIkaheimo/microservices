import {
  BadRequestException,
  Injectable,
  ValidationPipe as BaseValidationPipe,
  ValidationPipeOptions,
} from "@nestjs/common";
import { ValidationError } from "class-validator";

/**
 * Wrapper around the default validation pipe to display more meaningful and
 * consistent error messages.
 */
@Injectable()
export class ValidationPipe extends BaseValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super({
      exceptionFactory: (errors) => {
        return new BadRequestException({
          errors: this.formatErrors(errors),
        });
      },
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
      // Override hard-coded options with the passed ones.
      ...options,
    });
  }

  /**
   * Formats validation errors to be more consistent.
   */
  private formatErrors(errors: ValidationError[]) {
    return errors.reduce(
      (formattedErrors, { property, constraints }) => ({
        ...formattedErrors,
        [property]: Object.values(constraints).map(
          ([firstChar, ...rest]) => firstChar.toUpperCase() + rest.join("")
        ),
      }),
      {}
    );
  }
}
