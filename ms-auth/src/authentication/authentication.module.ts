import { Module } from '@nestjs/common';
import { JwtModule } from 'src/config';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PasswordService } from './password.service';

@Module({
  imports: [UsersModule, JwtModule.registerAsync()],
  providers: [
    PasswordService,
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
