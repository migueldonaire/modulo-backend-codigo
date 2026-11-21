import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders') // /api/v1/orders
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id') // GET /api/v1/orders/1 → el pedido con sus líneas
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post() // POST /api/v1/orders → 201
  @Throttle({ default: { limit: 3, ttl: 60_000 } }) // aquí, solo 3 por minuto
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
