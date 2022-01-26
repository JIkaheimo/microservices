import { IUser } from '@jikaheimo/common';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginData implements IUser {
  @IsString()
  @IsEmail()
  readonly email: IUser['email'];

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  readonly password: IUser['password'];
}
