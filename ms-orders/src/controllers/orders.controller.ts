import {
  CanModifyEntity,
  EntityGuard,
  IOrder,
  JwtAuthGuard,
  OrderStatus,
} from '@jikaheimo/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'src/dto';
import { Order } from 'src/entities';
import { OrdersService, TicketsService } from 'src/services';

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ticketsService: TicketsService,
    @Inject('TICKETING_NATS') private client: ClientProxy,
  ) {}

  @Post()
  async create(@Req() { user }, @Body() orderData: CreateOrderDto) {
    const ticket = await this.ticketsService.findOne(orderData.ticketId);

    if (await ticket.isReserved()) {
      throw new BadRequestException('Ticket is already reserved!');
    }

    const order = await this.ordersService.create({
      ...orderData,
      userId: user.id,
    });

    this.client.emit<number, IOrder>('order:created', order);

    return order;
  }

  @Get()
  async findAll(@Req() { user }) {
    const orders = await this.ordersService.findForUser(user.id);
    return orders;
  }

  @Get(':id')
  @CanModifyEntity(Order)
  @UseGuards(EntityGuard)
  findOne(@Param('id', ParseUUIDPipe) id: IOrder['id']) {
    return this.ordersService.findOne(id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @CanModifyEntity(Order)
  @UseGuards(EntityGuard)
  async cancel(@Req() { entity: order }) {
    const cancelledOrder = await this.ordersService.update(order.id, {
      ...order,
      status: OrderStatus.Cancelled,
    });

    this.client.emit<number, IOrder>('order:cancelled', cancelledOrder);

    return cancelledOrder;
  }
}
