import { IUser } from '@jikaheimo/common';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication/authentication.service';
import { RegistrationData } from './authentication/dto/registration-data.dto';
import { AuthenticatedRequest } from './authentication/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';
import { LocalAuthGuard } from './authentication/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller('api/users')
export class AppController {
  constructor(
    private readonly users: UsersService,
    private readonly auth: AuthenticationService,
  ) {}

  @Post('register')
  async register(
    @Body() registrationData: RegistrationData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUser> {
    const user = await this.users.create(registrationData);
    const token = await this.auth.getAccessToken(user);
    res.cookie('Authentication', token);

    return user;
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() { user }: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.auth.getAccessToken(user);
    res.cookie('Authentication', token);

    return user;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');
  }

  @Get('current-user')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() { user }: AuthenticatedRequest) {
    return user;
  }
}
