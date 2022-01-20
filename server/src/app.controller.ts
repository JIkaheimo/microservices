import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { CurrentUser, GqlAuthGuard } from './auth/gql-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    // return this.usersService.findById(user.id);
  }
}
