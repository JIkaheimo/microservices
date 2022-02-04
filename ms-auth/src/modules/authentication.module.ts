import { JwtModule } from '@jikaheimo/common';
import { Module } from '@nestjs/common';
import { AuthenticationService } from 'src/services/authentication.service';
import { PasswordService } from 'src/services/password.service';
import { JwtStrategy, LocalStrategy } from 'src/strategies';
import { UsersModule } from './users.module';

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
