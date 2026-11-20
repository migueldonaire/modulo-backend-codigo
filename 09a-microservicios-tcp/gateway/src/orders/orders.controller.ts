import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { callService } from '../call-service';
import { CreateOrderDto } from './create-order.dto';

@Controller('orders') // GET /api/orders, POST /api/orders
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  @Get()
  findAll() {
    return callService(this.ordersClient, 'get_orders', {});
  }

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return callService(this.ordersClient, 'create_order', dto);
  }
}
