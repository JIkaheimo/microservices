import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { RegistrationData } from './authentication/dto/registration-data.dto';

@Controller('api/users')
export class AppController {
  private logger: Logger = new Logger(AppController.name);

  @Post('register')
  register(@Body() registrationData: RegistrationData) {
    this.logger.debug('Creatring a new user!');
    return registrationData;
  }

  @Post('login')
  login() {
    return 'Hi there!';
  }

  @Post('logout')
  logout() {
    return 'Hi there!';
  }

  @Get('current-user')
  getCurrentUser() {
    return 'Hi there!';
  }
}
