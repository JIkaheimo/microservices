import { ITicket, JwtAuthGuard, Subject } from '@jikaheimo/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CanModifyEntity, EntityGuard } from 'src/entity.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities';
import { TicketsService } from './tickets.service';

@Controller('api/tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    @Inject('TICKETING_NATS') private client: ClientProxy,
  ) {}

  @Post()
  async create(@Req() { user }, @Body() ticketData: CreateTicketDto) {
    const ticket = await this.ticketsService.create({
      ...ticketData,
      userId: user.id,
    });
    this.client.emit<number, ITicket>(Subject.TicketCreated, ticket);
    return ticket;
  }

  @Get()
  async findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: ITicket['id']) {
    return this.ticketsService.findOne(id);
  }

  @Put(':id')
  @CanModifyEntity(Ticket)
  @UseGuards(EntityGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: ITicket['id'],
    @Body() ticketData: UpdateTicketDto,
  ) {
    const ticket = await this.ticketsService.update(id, ticketData);
    this.client.emit<number, ITicket>(Subject.TicketUpdated, ticket);
    return ticket;
  }

  @Delete(':id')
  @CanModifyEntity(Ticket)
  @UseGuards(EntityGuard)
  remove(@Param('id', ParseUUIDPipe) id: ITicket['id']) {
    return this.ticketsService.remove(id);
  }
}
