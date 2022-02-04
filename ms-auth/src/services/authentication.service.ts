import { EnvironmentVariables, IUser, JwtConfig } from '@jikaheimo/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService, UsersService } from 'src/services';

@Injectable()
export class AuthenticationService {
  private readonly secret: JwtConfig['secret'];

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly password: PasswordService,
    config: ConfigService<EnvironmentVariables>,
  ) {
    this.secret = config.get<JwtConfig>('jwt').secret;
  }

  /**
   * Returns the user with the given email and password.
   *
   * @throws {UnauthorizedException} Gets thrown if the given credentials
   * are invalid.
   */
  async getAuthenticatedUser(
    email: IUser['email'],
    password: IUser['password'],
  ) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid login credentials.');
    }
    await this.verifyPassword(password, user.password);
    return user;
  }

  /**
   * Authenticates (or logins) the user.
   */
  async getAccessToken({ id, email }: IUser) {
    const token = await this.jwt.signAsync(
      { id, email },
      {
        secret: this.secret,
      },
    );

    return token;
  }

  async getUserFromAuthenticationToken(token: string): Promise<IUser | null> {
    const { id } = this.jwt.verify(token, {
      secret: this.secret,
    });

    if (!id) return null;

    return this.users.findOne(id);
  }

  /**
   * Compares the given plain and hashed passwords. If they do not match
   * throws an error.
   *
   * @throws {BadRequestException}
   */
  private async verifyPassword(
    plainPassword: IUser['password'],
    hashedPassword: IUser['password'],
  ): Promise<void> {
    const passwordsMatch = await this.password.compare(
      plainPassword,
      hashedPassword,
    );
    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid login credentials.');
    }
  }
}
