import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TicketEventsController {
  constructor() {}

  @MessagePattern('tickets:findAll')
  asd(data) {
    console.log(data);
    return;
  }
}
