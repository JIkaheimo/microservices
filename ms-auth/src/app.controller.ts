import { IUser, JwtAuthGuard } from '@jikaheimo/common';
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
import { RegistrationData } from 'src/dto';
import { LocalAuthGuard } from 'src/guards';
import { AuthenticatedRequest } from 'src/interfaces';
import { AuthenticationService, UsersService } from 'src/services';

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
