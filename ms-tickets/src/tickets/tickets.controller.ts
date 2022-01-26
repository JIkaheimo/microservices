import { ITicket, JwtAuthGuard } from '@jikaheimo/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EntityGuard, CanModifyEntity } from 'src/entity.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities';
import { TicketsService } from './tickets.service';

@Controller('api/tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Req() { user }, @Body() ticketData: CreateTicketDto) {
    return this.ticketsService.create({ ...ticketData, userId: user.id });
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: ITicket['id']) {
    return this.ticketsService.findOne(id);
  }

  @Put(':id')
  @CanModifyEntity(Ticket)
  @UseGuards(EntityGuard)
  update(
    @Param('id', ParseUUIDPipe) id: ITicket['id'],
    @Body() ticketData: UpdateTicketDto,
  ) {
    return this.ticketsService.update(id, ticketData);
  }

  @Delete(':id')
  @CanModifyEntity(Ticket)
  @UseGuards(EntityGuard)
  remove(@Param('id', ParseUUIDPipe) id: ITicket['id']) {
    return this.ticketsService.remove(id);
  }
}
