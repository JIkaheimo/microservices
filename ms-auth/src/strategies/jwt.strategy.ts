import { JwtStrategy as CommonJwtStrategy } from '@jikaheimo/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/services';

@Injectable()
export class JwtStrategy extends CommonJwtStrategy {
  constructor(
    readonly config: ConfigService,
    private readonly userService: UsersService,
  ) {
    super(config);
  }

  async validate(payload) {
    return this.userService.findOne(payload.id);
  }
}
