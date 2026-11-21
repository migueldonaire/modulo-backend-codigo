import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { Book, NewOrder, Order } from './order';

@Injectable()
export class OrdersService {
  private orders: Order[] = []; // los pedidos viven solo en este servicio
  private nextId = 1;

  // orders-service también es cliente: necesita preguntar a books-service
  constructor(
    @Inject('BOOKS_SERVICE') private readonly booksClient: ClientProxy,
    @Inject('KAFKA') private readonly kafkaClient: ClientKafka, // el bus de eventos
  ) {}

  findAll(): Order[] {
    return this.orders;
  }

  async create(data: NewOrder): Promise<Order> {
    // 1. Preguntamos a books-service por el libro y ESPERAMOS la respuesta
    const book = await firstValueFrom(
      this.booksClient
        .send<Book | null>('get_book', data.bookId)
        .pipe(timeout(3000)),
    );

    // 2. Comprobamos. En un microservicio no hay HTTP: lanzamos RpcException
    if (!book) {
      throw new RpcException({
        statusCode: 404,
        message: 'Libro no encontrado',
      });
    }
    if (book.stock < data.quantity) {
      throw new RpcException({
        statusCode: 400,
        message: 'No hay stock suficiente',
      });
    }

    // 3. Guardamos el pedido
    const order: Order = {
      id: this.nextId++,
      bookId: book.id,
      title: book.title,
      quantity: data.quantity,
      total: book.price * data.quantity,
      createdAt: new Date().toISOString(),
    };
    this.orders.push(order);

    // 4. Avisamos de lo que ha pasado. emit: publica y NO espera respuesta
    this.kafkaClient.emit('order-created', order); // topic 'order-created'

    return order;
  }
}
