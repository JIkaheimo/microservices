import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TicketsEventController {
  constructor() {}

  @MessagePattern('tickets:findAll')
  asd(data) {
    console.log(data);
    return;
  }
}
