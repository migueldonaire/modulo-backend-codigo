import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { NewOrder } from './order';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('get_orders')
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern('create_order')
  create(@Payload() data: NewOrder) {
    return this.ordersService.create(data); // devuelve una promesa: Nest espera
  }
}
