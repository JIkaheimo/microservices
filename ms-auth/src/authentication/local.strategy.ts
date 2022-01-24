import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';

/**
 * Allows the user to authenticate with the email and password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    // Just check that there exists an user with the given login credentials
    return this.auth.getAuthenticatedUser(email, password);
  }
}
