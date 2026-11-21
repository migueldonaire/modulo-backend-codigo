import { Controller } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import type { NewBook } from './book'; // type: solo usamos el tipo, no código
import type { OrderCreated } from './order';
import { BooksService } from './books.service';

@Controller() // sin ruta: aquí no llegan peticiones HTTP, llegan mensajes
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Transport.TCP: este mensaje solo llega por TCP (no por Kafka)
  @MessagePattern('get_books', Transport.TCP)
  findAll() {
    return this.booksService.findAll(); // lo que devuelves es la respuesta
  }

  // @Payload() saca los datos que vienen dentro del mensaje
  @MessagePattern('get_book', Transport.TCP)
  findOne(@Payload() id: number) {
    return this.booksService.findOne(id);
  }

  @MessagePattern('create_book', Transport.TCP)
  create(@Payload() data: NewBook) {
    return this.booksService.create(data);
  }

  // Evento de Kafka: alguien ha hecho un pedido → bajamos el stock
  @EventPattern('order-created', Transport.KAFKA)
  onOrderCreated(@Payload() order: OrderCreated) {
    this.booksService.decreaseStock(order.bookId, order.quantity);
  }
}
