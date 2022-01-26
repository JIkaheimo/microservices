import { ITicket, JwtAuthGuard } from '@jikaheimo/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('api/tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Req() req, @Body() ticketData: CreateTicketDto) {
    return this.ticketsService.create({ ...ticketData, userId: req.user.id });
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: ITicket['id']) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: ITicket['id'],
    @Body() ticketData: UpdateTicketDto,
  ) {
    return this.ticketsService.update(id, ticketData);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: ITicket['id']) {
    return this.ticketsService.remove(id);
  }
}
