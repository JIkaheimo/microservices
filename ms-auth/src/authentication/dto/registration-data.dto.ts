import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UniqueOnDatabase } from 'src/core/decorators';
import { User } from 'src/users/entities/user.entity';
import { IUser } from 'src/users/user.interface';

export class RegistrationData implements IUser {
  @IsEmail()
  @Transform((email) => email.value.trim())
  @UniqueOnDatabase(User)
  readonly email: IUser['email'];

  @IsString()
  @Transform((password) => password.value.trim())
  @MinLength(4)
  @MaxLength(20)
  readonly password: IUser['password'];
}
