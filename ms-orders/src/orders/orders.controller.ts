import { IOrder, JwtAuthGuard, Subject } from '@jikaheimo/common';
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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities';
import { OrdersService } from './orders.service';

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject('TICKETING_NATS') private client: ClientProxy,
  ) {}

  @Post()
  async create(@Req() { user }, @Body() orderData: CreateOrderDto) {
    const order = await this.ordersService.create({
      ...orderData,
      userId: user.id,
    });
    this.client.emit<number, IOrder>(Subject.OrderCreated, order);
    return order;
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: IOrder['id']) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @CanModifyEntity(Order)
  @UseGuards(EntityGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: IOrder['id'],
    @Body() orderData: UpdateOrderDto,
  ) {
    const order = await this.ordersService.update(id, orderData);
    this.client.emit<number, IOrder>(Subject.OrderUpdated, order);
    return order;
  }

  @Delete(':id')
  @CanModifyEntity(Order)
  @UseGuards(EntityGuard)
  remove(@Param('id', ParseUUIDPipe) id: IOrder['id']) {
    return this.ordersService.remove(id);
  }
}
