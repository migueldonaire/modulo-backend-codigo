import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { NewBook } from './book'; // type: solo usamos el tipo, no código
import { BooksService } from './books.service';

@Controller() // sin ruta: aquí no llegan peticiones HTTP, llegan mensajes
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @MessagePattern('get_books') // responde a los mensajes 'get_books'
  findAll() {
    return this.booksService.findAll(); // lo que devuelves es la respuesta
  }

  // @Payload() saca los datos que vienen dentro del mensaje
  @MessagePattern('get_book')
  findOne(@Payload() id: number) {
    return this.booksService.findOne(id);
  }

  @MessagePattern('create_book')
  create(@Payload() data: NewBook) {
    return this.booksService.create(data);
  }
}
